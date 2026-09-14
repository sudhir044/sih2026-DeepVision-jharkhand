import crypto from "crypto";
import sql from "../config/db.js";

export const createCertificate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { moduleId } = req.body;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: "Module ID is required",
      });
    }

    // Resolve moduleId if code passed (e.g., 'FIRE_01')
    let numericModuleId = moduleId;
    if (typeof moduleId === "string" && !/^\d+$/.test(moduleId)) {
      const mod = await sql`SELECT id FROM training_modules WHERE code = ${moduleId}`;
      if (mod.length > 0) {
        numericModuleId = mod[0].id;
      } else {
        return res.status(404).json({
          success: false,
          message: "Training module not found",
        });
      }
    } else {
      numericModuleId = parseInt(moduleId, 10);
    }

    // Get the latest training result from the database
    const results = await sql`
      SELECT id, score, status
      FROM training_results
      WHERE user_id = ${userId}
        AND module_id = ${numericModuleId}
      ORDER BY completed_at DESC
      LIMIT 1
    `;

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Training result not found",
      });
    }

    const trainingResult = results[0];

    // Certificate only for passed training
    if (trainingResult.status !== "passed") {
      return res.status(400).json({
        success: false,
        message: "Certificate can only be issued after passing training",
      });
    }

    // Helper to fetch rich certificate details
    const getDetailedCertificate = async (certId) => {
      const rows = await sql`
        SELECT 
          c.id,
          c.certificate_id,
          c.user_id,
          u.name AS worker_name,
          u.email AS worker_email,
          c.module_id,
          tm.title AS module_title,
          tm.code AS module_code,
          c.score,
          c.verification_hash,
          c.issued_at
        FROM certificates c
        INNER JOIN users u ON c.user_id = u.id
        INNER JOIN training_modules tm ON c.module_id = tm.id
        WHERE c.id = ${certId}
      `;
      if (!rows.length) return null;
      const cert = rows[0];
      return {
        ...cert,
        certificateId: cert.certificate_id,
        participantName: cert.worker_name,
        workerName: cert.worker_name,
        moduleName: cert.module_title,
        moduleTitle: cert.module_title,
        moduleId: cert.module_code || String(cert.module_id),
        issuedAt: cert.issued_at,
        verificationHash: cert.verification_hash,
      };
    };

    // Check if certificate already exists
    const existingCertificate = await sql`
      SELECT id
      FROM certificates
      WHERE user_id = ${userId}
        AND module_id = ${numericModuleId}
      LIMIT 1
    `;

    if (existingCertificate.length > 0) {
      const detailedCert = await getDetailedCertificate(existingCertificate[0].id);
      return res.status(200).json({
        success: true,
        message: "Certificate already exists",
        certificate: detailedCert,
      });
    }

    // Generate unique certificate ID
    const certificateId = `SAFE-${Date.now()}`;

    // Data used to generate certificate hash
    const certificateData = {
      certificateId,
      userId,
      moduleId: numericModuleId,
      score: trainingResult.score,
    };

    const verificationHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(certificateData))
      .digest("hex");

    // Store certificate
    const certificate = await sql`
      INSERT INTO certificates (
        certificate_id,
        user_id,
        module_id,
        score,
        verification_hash
      )
      VALUES (
        ${certificateId},
        ${userId},
        ${numericModuleId},
        ${trainingResult.score},
        ${verificationHash}
      )
      RETURNING id
    `;

    const detailedCert = await getDetailedCertificate(certificate[0].id);

    res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      certificate: detailedCert,
    });
  } catch (error) {
    console.error("Create certificate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create certificate",
    });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const certParam = req.params.certificateId || req.params.id;

    const results = await sql`
      SELECT 
        c.id,
        c.certificate_id,
        c.user_id,
        u.name AS worker_name,
        u.email AS worker_email,
        c.module_id,
        tm.title AS module_title,
        tm.code AS module_code,
        c.score,
        c.verification_hash,
        c.issued_at
      FROM certificates c
      INNER JOIN users u ON c.user_id = u.id
      INNER JOIN training_modules tm ON c.module_id = tm.id
      WHERE c.certificate_id = ${certParam}
         OR c.id::text = ${certParam}
    `;

    if (results.length === 0) {
      if (req.headers.accept?.includes("text/html") && !req.headers.accept?.includes("application/json")) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>DeepVision - Certificate Not Found</title>
            <style>
              body { font-family: system-ui, sans-serif; background: #0b0f19; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
              .card { background: #161f33; border: 1px solid #ef4444; border-radius: 16px; padding: 32px; max-width: 480px; text-align: center; }
              h2 { color: #ef4444; margin-top: 0; }
              p { color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>❌ Certificate Not Found</h2>
              <p>The certificate with identifier <strong>${certParam}</strong> could not be found or has not been verified.</p>
            </div>
          </body>
          </html>
        `);
      }
      return res.status(404).json({
        success: false,
        message: "Certificate not found or invalid",
      });
    }

    const cert = results[0];

    // If scanned via browser camera/QR scanner, serve verified HTML dashboard
    if (req.headers.accept?.includes("text/html") && !req.headers.accept?.includes("application/json")) {
      const issuedStr = new Date(cert.issued_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });

      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Verified: ${cert.certificate_id} - DeepVision Jharkhand</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background: #090d16;
              color: #f8fafc;
              margin: 0;
              padding: 24px 16px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .cert-card {
              background: #111827;
              border: 2px solid #10b981;
              border-radius: 20px;
              padding: 32px;
              max-width: 540px;
              width: 100%;
              box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(16, 185, 129, 0.15);
              text-align: center;
            }
            .badge {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: rgba(16, 185, 129, 0.15);
              border: 1px solid #10b981;
              color: #34d399;
              padding: 8px 18px;
              border-radius: 9999px;
              font-weight: 700;
              font-size: 13px;
              letter-spacing: 0.5px;
              margin-bottom: 20px;
            }
            .gov-header {
              font-size: 12px;
              font-weight: 600;
              color: #94a3b8;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .title {
              font-size: 24px;
              font-weight: 800;
              color: #f1f5f9;
              margin: 0 0 20px 0;
            }
            .details-table {
              width: 100%;
              text-align: left;
              margin: 20px 0;
              border-collapse: collapse;
            }
            .details-table tr {
              border-bottom: 1px solid #1e293b;
            }
            .details-table td {
              padding: 12px 6px;
              font-size: 14px;
            }
            .details-table td.label {
              color: #94a3b8;
              font-weight: 500;
              width: 40%;
            }
            .details-table td.val {
              color: #ffffff;
              font-weight: 700;
            }
            .hash-box {
              background: #0a0e17;
              border: 1px solid #1e293b;
              border-radius: 8px;
              padding: 10px;
              margin-top: 15px;
              font-family: monospace;
              font-size: 11px;
              color: #38bdf8;
              word-break: break-all;
              text-align: left;
            }
            .hash-title {
              font-size: 10px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 4px;
              font-weight: bold;
            }
            .footer-note {
              font-size: 11px;
              color: #64748b;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="cert-card">
            <div class="badge">
              <span>✓</span> OFFICIALLY VERIFIED CERTIFICATE
            </div>
            <div class="gov-header">Government of Jharkhand • SIH26041</div>
            <h1 class="title">DeepVision Safety Record</h1>

            <table class="details-table">
              <tr>
                <td class="label">Certificate ID</td>
                <td class="val" style="color: #f59e0b;">${cert.certificate_id}</td>
              </tr>
              <tr>
                <td class="label">Trainee Name</td>
                <td class="val">${cert.worker_name}</td>
              </tr>
              <tr>
                <td class="label">Trainee Email</td>
                <td class="val">${cert.worker_email}</td>
              </tr>
              <tr>
                <td class="label">Training Module</td>
                <td class="val">${cert.module_title} (${cert.module_code})</td>
              </tr>
              <tr>
                <td class="label">Assessment Score</td>
                <td class="val" style="color: #10b981;">${cert.score}% (PASSED)</td>
              </tr>
              <tr>
                <td class="label">Date of Issue</td>
                <td class="val">${issuedStr}</td>
              </tr>
              <tr>
                <td class="label">Verification Status</td>
                <td class="val" style="color: #34d399;">Authenticated & Active</td>
              </tr>
            </table>

            <div class="hash-box">
              <div class="hash-title">Cryptographic SHA-256 Signature</div>
              ${cert.verification_hash}
            </div>

            <div class="footer-note">
              DeepVision AR-Based Industrial Safety Training Platform &bull; Certified Record
            </div>
          </div>
        </body>
        </html>
      `);
    }

    res.status(200).json({
      success: true,
      certificate: cert,
    });
  } catch (error) {
    console.error("Verify certificate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify certificate",
    });
  }
};
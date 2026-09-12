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

    // Check if certificate already exists
    const existingCertificate = await sql`
      SELECT *
      FROM certificates
      WHERE user_id = ${userId}
        AND module_id = ${numericModuleId}
    `;

    if (existingCertificate.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Certificate already exists",
        certificate: existingCertificate[0],
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
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      certificate: certificate[0],
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
      return res.status(404).json({
        success: false,
        message: "Certificate not found or invalid",
      });
    }

    res.status(200).json({
      success: true,
      certificate: results[0],
    });
  } catch (error) {
    console.error("Verify certificate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify certificate",
    });
  }
};
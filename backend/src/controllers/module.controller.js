import sql from "../config/db.js";

export const getModules = async (req, res) => {
  try {
    const modules = await sql`
      SELECT 
        id,
        code,
        title,
        description,
        duration,
        difficulty,
        status
      FROM training_modules
      ORDER BY id ASC
    `;

    res.status(200).json({
      success: true,
      modules,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch training modules",
    });
  }
};

export const getModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const result = await sql`
      SELECT 
        id,
        code,
        title,
        description,
        duration,
        difficulty,
        status
      FROM training_modules
      WHERE ${isNumeric ? sql`id = ${parseInt(id, 10)}` : sql`code = ${id}`}
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Training module not found",
      });
    }

    res.status(200).json({
      success: true,
      module: result[0],
    });
  } catch (error) {
    console.error("Error fetching module:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch training module",
    });
  }
};

export async function verifyCertificate(req, res) {
  try {
    const { certificateId } = req.params;

    const result = await sql`
      SELECT
        c.certificate_id,
        c.score,
        c.verification_hash,
        c.issued_at,
        u.name,
        u.email,
        m.id AS module_id,
        m.title AS module_title
      FROM certificates c
      JOIN users u
        ON c.user_id = u.id
      JOIN training_modules m
        ON c.module_id = m.id
      WHERE c.certificate_id = ${certificateId}
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Certificate not found",
      });
    }

    const certificate = result[0];

    return res.json({
      success: true,
      valid: true,
      certificate: {
        certificateId: certificate.certificate_id,
        participantName: certificate.name,
        moduleId: certificate.module_id,
        moduleName: certificate.module_title,
        score: certificate.score,
        issuedAt: certificate.issued_at,
        verificationHash: certificate.verification_hash,
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);

    return res.status(500).json({
      success: false,
      valid: false,
      message: "Unable to verify certificate",
    });
  }
}
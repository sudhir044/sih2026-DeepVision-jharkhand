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

    // Get the latest training result from the database
    const results = await sql`
      SELECT id, score, status
      FROM training_results
      WHERE user_id = ${userId}
        AND module_id = ${moduleId}
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
        AND module_id = ${moduleId}
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
      moduleId,
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
        ${moduleId},
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
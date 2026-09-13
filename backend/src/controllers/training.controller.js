import sql from "../config/db.js";

export const submitTrainingResult = async (req, res) => {
  try {
    const {
      moduleId,
      score,
      duration,
      correctActions,
      wrongActions,
      safetyViolations,
      status,
    } = req.body;

    const userId = req.user.userId;

    // Validate required fields
    if (
      !moduleId ||
      score === undefined ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "Module ID, score and status are required",
      });
    }

    // Resolve moduleId (supports string codes like 'FIRE_01' and numeric IDs)
    let numericModuleId = moduleId;
    if (typeof moduleId === "string" && !/^\d+$/.test(moduleId)) {
      const mod = await sql`
        SELECT id
        FROM training_modules
        WHERE code = ${moduleId}
      `;
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
      const mod = await sql`
        SELECT id
        FROM training_modules
        WHERE id = ${numericModuleId}
      `;
      if (mod.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Training module not found",
        });
      }
    }

    // Save result
    const result = await sql`
      INSERT INTO training_results (
        user_id,
        module_id,
        score,
        duration,
        correct_actions,
        wrong_actions,
        safety_violations,
        status
      )
      VALUES (
        ${userId},
        ${numericModuleId},
        ${score},
        ${duration || 0},
        ${correctActions || 0},
        ${wrongActions || 0},
        ${safetyViolations || 0},
        ${status}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      message: "Training result saved successfully",
      result: result[0],
    });
  } catch (error) {
    console.error("Submit training result error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save training result",
    });
  }
};

export const getTrainingHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const history = await sql`
      SELECT
        tr.id,
        tr.module_id,
        tm.title,
        tr.score,
        tr.duration,
        tr.correct_actions,
        tr.wrong_actions,
        tr.safety_violations,
        tr.status,
        tr.completed_at
      FROM training_results tr
      JOIN training_modules tm
        ON tr.module_id = tm.id
      WHERE tr.user_id = ${userId}
      ORDER BY tr.completed_at DESC
    `;

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Get training history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch training history",
    });
  }
};
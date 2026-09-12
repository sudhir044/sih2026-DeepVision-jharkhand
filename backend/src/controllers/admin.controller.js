import sql from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalWorkers = await sql`
      SELECT COUNT(*) AS count
      FROM users
      WHERE role = 'worker'
    `;

    const totalTrainingAttempts = await sql`
      SELECT COUNT(*) AS count
      FROM training_results
    `;

    const passedTrainings = await sql`
      SELECT COUNT(*) AS count
      FROM training_results
      WHERE status = 'passed'
    `;

    const failedTrainings = await sql`
      SELECT COUNT(*) AS count
      FROM training_results
      WHERE status = 'failed'
    `;

    const totalCertificates = await sql`
      SELECT COUNT(*) AS count
      FROM certificates
    `;

    const totalModules = await sql`
      SELECT COUNT(*) AS count
      FROM training_modules
      WHERE status = 'available'
    `;

    res.status(200).json({
      success: true,
      dashboard: {
        totalWorkers: Number(totalWorkers[0].count),
        totalTrainingAttempts: Number(totalTrainingAttempts[0].count),
        passedTrainings: Number(passedTrainings[0].count),
        failedTrainings: Number(failedTrainings[0].count),
        totalCertificates: Number(totalCertificates[0].count),
        totalModules: Number(totalModules[0].count),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const workers = await sql`
      SELECT
        u.id,
        u.name,
        u.email,
        u.created_at,

        COUNT(DISTINCT tr.id) AS total_training_attempts,

        COUNT(
          DISTINCT CASE
            WHEN tr.status = 'passed'
            THEN tr.id
          END
        ) AS passed_trainings,

        COUNT(DISTINCT c.id) AS certificates

      FROM users u

      LEFT JOIN training_results tr
        ON u.id = tr.user_id

      LEFT JOIN certificates c
        ON u.id = c.user_id

      WHERE u.role = 'worker'

      GROUP BY
        u.id,
        u.name,
        u.email,
        u.created_at

      ORDER BY u.created_at DESC
    `;

    const formattedWorkers = workers.map((worker) => ({
      id: worker.id,
      name: worker.name,
      email: worker.email,
      totalTrainingAttempts: Number(worker.total_training_attempts),
      passedTrainings: Number(worker.passed_trainings),
      certificates: Number(worker.certificates),
      createdAt: worker.created_at,
    }));

    res.status(200).json({
      success: true,
      workers: formattedWorkers,
    });
  } catch (error) {
    console.error("Get workers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers",
    });
  }
};

export const getTrainingResults = async (req, res) => {
  try {
    const results = await sql`
      SELECT
        tr.id,
        u.id AS user_id,
        u.name AS worker_name,
        u.email AS worker_email,
        tm.id AS module_id,
        tm.title AS module_title,
        tr.score,
        tr.duration,
        tr.correct_actions,
        tr.wrong_actions,
        tr.safety_violations,
        tr.status,
        tr.completed_at
      FROM training_results tr

      INNER JOIN users u
        ON tr.user_id = u.id

      INNER JOIN training_modules tm
        ON tr.module_id = tm.id

      ORDER BY tr.completed_at DESC
    `;

    const formattedResults = results.map((result) => ({
      id: result.id,

      worker: {
        id: result.user_id,
        name: result.worker_name,
        email: result.worker_email,
      },

      module: {
        id: result.module_id,
        title: result.module_title,
      },

      score: result.score,
      duration: result.duration,
      correctActions: result.correct_actions,
      wrongActions: result.wrong_actions,
      safetyViolations: result.safety_violations,
      status: result.status,
      completedAt: result.completed_at,
    }));

    res.status(200).json({
      success: true,
      results: formattedResults,
    });
  } catch (error) {
    console.error("Get training results error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch training results",
    });
  }
};
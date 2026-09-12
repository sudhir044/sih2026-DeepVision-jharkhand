import sql from "../config/db.js";

export const getModules = async (req, res) => {
  try {
    const modules = await sql`
      SELECT 
        id,
        title,
        description,
        duration,
        difficulty,
        status
      FROM training_modules
      ORDER BY created_at ASC
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
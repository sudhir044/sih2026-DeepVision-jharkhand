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
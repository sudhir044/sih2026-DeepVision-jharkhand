import modules from "../models/module.model.js";

export const getModules = (req, res) => {
  res.json({
    success: true,
    modules,
  });
};
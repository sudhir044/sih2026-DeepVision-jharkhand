import express from "express";
import {
  getModules,
  getModuleById,
} from "../controllers/module.controller.js";

const router = express.Router();

router.get("/", getModules);

router.get("/:id", getModuleById);

export default router;
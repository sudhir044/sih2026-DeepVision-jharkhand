import express from "express";
import { getModules } from "../controllers/module.controller.js";

const router = express.Router();

router.get("/", getModules);

export default router;
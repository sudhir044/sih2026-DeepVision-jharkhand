import express from "express";
import {
  submitTrainingResult,
  getTrainingHistory,
} from "../controllers/training.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/result", protect, submitTrainingResult);

router.get("/history", protect, getTrainingHistory);

export default router;
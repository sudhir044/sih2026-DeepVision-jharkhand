import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

import {
  getDashboardStats,
  getWorkers,
  getTrainingResults,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);

router.get(
  "/workers",
  protect,
  adminOnly,
  getWorkers
);

router.get(
  "/results",
  protect,
  adminOnly,
  getTrainingResults
);

export default router;
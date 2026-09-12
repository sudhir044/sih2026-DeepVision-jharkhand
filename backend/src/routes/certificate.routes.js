import express from "express";
import {
  createCertificate,
  verifyCertificate,
} from "../controllers/certificate.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createCertificate);

router.get("/verify/:certificateId", verifyCertificate);

export default router;
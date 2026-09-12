import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moduleRoutes from "./routes/module.routes.js";
import authRoutes from "./routes/auth.routes.js";
import trainingRoutes from "./routes/training.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/modules", moduleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "SafeAR Jharkhand Backend is running",
    status: "success",
  });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
export { app, server };
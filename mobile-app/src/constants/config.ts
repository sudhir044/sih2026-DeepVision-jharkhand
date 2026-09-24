import { Platform } from "react-native";

const PRODUCTION_API_URL =
    "https://sih2026-deepvision-jharkhand-backend-1.onrender.com";

export const API_BASE_URL =
    Platform.OS === "web"
        ? "http://localhost:5000"
        : PRODUCTION_API_URL;
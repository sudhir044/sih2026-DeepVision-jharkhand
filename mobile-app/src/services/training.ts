import { apiRequest } from "./api";
import { getToken } from "./auth";

export interface TrainingResultPayload {
    moduleId: string | number;
    score: number;
    duration?: number;
    correctActions?: number;
    wrongActions?: number;
    safetyViolations?: number;
    status: "passed" | "failed";
}

export interface TrainingHistoryItem {
    id: number;
    module_id: number;
    title: string;
    score: number;
    duration: number;
    correct_actions: number;
    wrong_actions: number;
    safety_violations: number;
    status: "passed" | "failed";
    completed_at: string;
}

export async function submitTrainingResult(payload: TrainingResultPayload) {
    const token = await getToken();
    if (!token) {
        throw new Error("Authentication session expired.");
    }

    return await apiRequest("/api/training/result", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
}

export async function getTrainingHistory(): Promise<TrainingHistoryItem[]> {
    const token = await getToken();
    if (!token) {
        throw new Error("Authentication session expired.");
    }

    const data = await apiRequest("/api/training/history", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data.history || data.results || [];
}

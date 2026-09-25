import { apiRequest } from "./api";
import { getToken } from "./auth";
import { storageService } from "./storage";

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
    id: number | string;
    module_id: number | string;
    title: string;
    score: number;
    duration: number | string;
    correct_actions: number;
    wrong_actions: number;
    safety_violations: number;
    status: "passed" | "failed";
    completed_at: string;
}

export async function submitTrainingResult(payload: TrainingResultPayload) {
    const token = await getToken();

    // Also persist locally for offline operation
    const localRecord = {
        id: `log-${Date.now()}`,
        module_id: payload.moduleId,
        module: typeof payload.moduleId === "string" ? payload.moduleId : "Fire & Explosion Response",
        score: payload.score,
        status: payload.status.toUpperCase(),
        correctActions: payload.correctActions ?? 0,
        wrongActions: payload.wrongActions ?? 0,
        safetyViolations: payload.safetyViolations ?? 0,
        timeTaken: payload.duration ? `${Math.floor(payload.duration / 60)}:${String(payload.duration % 60).padStart(2, "0")}` : "02:14",
        date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }),
        synced: !!token,
    };
    await storageService.saveTrainingResult(localRecord);

    if (!token) {
        return { success: true, offline: true, data: localRecord };
    }

    try {
        return await apiRequest("/api/training/result", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.warn("[Training] Online submit failed, saved to offline cache:", err);
        return { success: true, offline: true, data: localRecord };
    }
}

export async function getTrainingHistory(): Promise<TrainingHistoryItem[]> {
    const token = await getToken();
    if (!token) {
        const local = await storageService.getCompletedTrainings();
        return local.map((item, idx) => ({
            id: item.id || idx + 1,
            module_id: item.module_id || 1,
            title: item.module || "Fire & Explosion Response",
            score: item.score,
            duration: item.timeTaken || 120,
            correct_actions: item.correctActions || 0,
            wrong_actions: item.wrongActions || 0,
            safety_violations: item.safetyViolations || 0,
            status: ((item.status || "passed").toLowerCase() === "passed" ? "passed" : "failed") as "passed" | "failed",
            completed_at: item.date || new Date().toISOString(),
        }));
    }

    try {
        const data = await apiRequest("/api/training/history", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.history || data.results || [];
    } catch (err) {
        console.warn("[Training] Remote fetch failed, fallback to local storage:", err);
        const local = await storageService.getCompletedTrainings();
        return local.map((item, idx) => ({
            id: item.id || idx + 1,
            module_id: item.module_id || 1,
            title: item.module || "Fire & Explosion Response",
            score: item.score,
            duration: item.timeTaken || 120,
            correct_actions: item.correctActions || 0,
            wrong_actions: item.wrongActions || 0,
            safety_violations: item.safetyViolations || 0,
            status: ((item.status || "passed").toLowerCase() === "passed" ? "passed" : "failed") as "passed" | "failed",
            completed_at: item.date || new Date().toISOString(),
        }));
    }
}

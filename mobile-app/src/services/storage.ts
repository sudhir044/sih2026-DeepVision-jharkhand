import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEYS = {
  LANGUAGE: "safear_lang",
  COMPLETED_TRAININGS: "safear_trainings",
  CERTIFICATES: "safear_certificates",
  USER_PROFILE: "safear_user",
};

// In-memory fallback for web or when SecureStore is unavailable
const memoryStore: Record<string, string> = {};

async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined" ? (localStorage.getItem(key) || memoryStore[key] || null) : (memoryStore[key] || null);
    }
    const val = await SecureStore.getItemAsync(key);
    return val !== null ? val : memoryStore[key] || null;
  } catch {
    return memoryStore[key] || null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  memoryStore[key] = value;
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (e) {
    console.warn("[Storage] setItem warning:", e);
  }
}

// Default Initial Data
export const defaultProfile = {
  name: "Ramesh Kumar",
  unit: "Tata Steel Ltd · Jamshedpur Unit",
  employeeId: "W1024",
};

export const defaultTrainings = [
  {
    id: "log-101",
    module: "Fire & Explosion Response",
    score: 86,
    status: "PASSED",
    correctActions: 7,
    wrongActions: 2,
    safetyViolations: 1,
    timeTaken: "02:14",
    date: "10 Sep 2026",
    certificateId: "SAFE-2026-001024",
    synced: true,
  },
  {
    id: "log-102",
    module: "Gas Leak & Confined Space",
    score: 92,
    status: "PASSED",
    correctActions: 9,
    wrongActions: 1,
    safetyViolations: 0,
    timeTaken: "03:05",
    date: "08 Sep 2026",
    certificateId: "SAFE-2026-001022",
    synced: true,
  },
  {
    id: "log-103",
    module: "Fire & Explosion Response",
    score: 88,
    status: "PASSED",
    correctActions: 8,
    wrongActions: 1,
    safetyViolations: 0,
    timeTaken: "02:20",
    date: "05 Sep 2026",
    certificateId: "SAFE-2026-001018",
    synced: true,
  },
];

export const storageService = {
  getLanguage: async (): Promise<string> => {
    try {
      const lang = await getItem(KEYS.LANGUAGE);
      return lang || "en";
    } catch {
      return "en";
    }
  },

  setLanguage: async (lang: string): Promise<void> => {
    await setItem(KEYS.LANGUAGE, lang);
  },

  getCompletedTrainings: async (): Promise<any[]> => {
    try {
      const data = await getItem(KEYS.COMPLETED_TRAININGS);
      return data ? JSON.parse(data) : defaultTrainings;
    } catch {
      return defaultTrainings;
    }
  },

  saveTrainingResult: async (result: any): Promise<any[]> => {
    try {
      const existing = await storageService.getCompletedTrainings();
      const updated = [result, ...existing];
      await setItem(KEYS.COMPLETED_TRAININGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn("[Storage] saveTrainingResult error:", e);
      return defaultTrainings;
    }
  },

  getUserProfile: async (): Promise<any> => {
    try {
      const data = await getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },

  saveUserProfile: async (profile: any): Promise<void> => {
    try {
      await setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn("[Storage] saveUserProfile error:", e);
    }
  },
};

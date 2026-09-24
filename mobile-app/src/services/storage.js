import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  LANGUAGE: '@safear_lang',
  COMPLETED_TRAININGS: '@safear_trainings',
  CERTIFICATES: '@safear_certificates',
  USER_PROFILE: '@safear_user',
};

// Default Initial Data
const defaultProfile = {
  name: 'Ramesh Kumar',
  unit: 'Tata Steel Ltd · Jamshedpur Unit',
  employeeId: 'W1024',
};

const defaultTrainings = [
  {
    id: 'log-101',
    module: 'Fire & Explosion Response',
    score: 86,
    status: 'PASSED',
    correctActions: 7,
    wrongActions: 2,
    safetyViolations: 1,
    timeTaken: '02:14',
    date: '10 Sep 2026',
    certificateId: 'SAFE-2026-001024',
    synced: true,
  },
  {
    id: 'log-102',
    module: 'Gas Leak & Confined Space',
    score: 92,
    status: 'PASSED',
    correctActions: 9,
    wrongActions: 1,
    safetyViolations: 0,
    timeTaken: '03:05',
    date: '08 Sep 2026',
    certificateId: 'SAFE-2026-001022',
    synced: true,
  },
  {
    id: 'log-103',
    module: 'Fire & Explosion Response',
    score: 88,
    status: 'PASSED',
    correctActions: 8,
    wrongActions: 1,
    safetyViolations: 0,
    timeTaken: '02:20',
    date: '05 Sep 2026',
    certificateId: 'SAFE-2026-001018',
    synced: true,
  },
];

export const storageService = {
  // Language Preference
  getLanguage: async () => {
    try {
      const lang = await AsyncStorage.getItem(KEYS.LANGUAGE);
      return lang || 'en';
    } catch {
      return 'en';
    }
  },

  setLanguage: async (lang) => {
    try {
      await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
    } catch (e) {
      console.warn('Storage setLanguage error', e);
    }
  },

  // Completed Trainings & Scores
  getCompletedTrainings: async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.COMPLETED_TRAININGS);
      return data ? JSON.parse(data) : defaultTrainings;
    } catch {
      return defaultTrainings;
    }
  },

  saveTrainingResult: async (result) => {
    try {
      const existing = await storageService.getCompletedTrainings();
      const updated = [result, ...existing];
      await AsyncStorage.setItem(
        KEYS.COMPLETED_TRAININGS,
        JSON.stringify(updated)
      );
      return updated;
    } catch (e) {
      console.warn('Storage saveResult error', e);
      return defaultTrainings;
    }
  },

  // User Profile
  getUserProfile: async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },
};

import { NativeModules, Platform, DeviceEventEmitter, EmitterSubscription } from 'react-native';

const { UnityBridge } = NativeModules;

export interface UnityLaunchResult {
    success: boolean;
    completed?: boolean;
    error?: string;
}

export interface UnityEventData {
    completed: boolean;
    resultCode?: number;
}

/**
 * Checks whether the Unity 3D AR runtime is installed and accessible on this Android device.
 */
export const isUnityAvailable = async (): Promise<boolean> => {
    if (Platform.OS !== 'android' || !UnityBridge) {
        return false;
    }
    try {
        if (typeof UnityBridge.isUnityAvailable === 'function') {
            return await UnityBridge.isUnityAvailable();
        }
        return !!UnityBridge.launchAR;
    } catch {
        return false;
    }
};

/**
 * Launches the native Unity AR activity from React Native using startActivityForResult.
 * Resolves with completed = true if the task was completed, or completed = false if closed via Back.
 */
export const launchUnityAR = async (): Promise<UnityLaunchResult> => {
    if (Platform.OS !== 'android') {
        return {
            success: false,
            error: 'Unity 3D AR is supported on Android devices.'
        };
    }

    if (!UnityBridge || typeof UnityBridge.launchAR !== 'function') {
        return {
            success: false,
            error: 'Unity AR native module is not registered on this device.'
        };
    }

    try {
        const result = await UnityBridge.launchAR();
        return {
            success: true,
            completed: result?.completed === true
        };
    } catch (e: any) {
        const errorMsg = e?.message || 'Failed to initialize Unity AR runtime';
        console.warn('[UnityBridge] Launch error:', errorMsg);
        return {
            success: false,
            error: errorMsg
        };
    }
};

/**
 * Adds an event listener for Unity AR events:
 * - "UnityARCompleted": AR drill task was completed successfully.
 * - "UnityARClosed": Unity was closed via Back button without completion.
 */
export const addUnityEventListener = (
    event: 'UnityARCompleted' | 'UnityARClosed',
    callback: (data: UnityEventData) => void
): EmitterSubscription => {
    return DeviceEventEmitter.addListener(event, callback);
};

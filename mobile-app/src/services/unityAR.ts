import { NativeModules, Platform, Alert } from 'react-native';

const { UnityBridge } = NativeModules;

export interface UnityLaunchResult {
    success: boolean;
    error?: string;
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
 * Launches the native Unity AR activity from React Native.
 * If Unity is unavailable or encounters an error, returns a structured error without crashing.
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
        await UnityBridge.launchAR();
        return { success: true };
    } catch (e: any) {
        const errorMsg = e?.message || 'Failed to initialize Unity AR runtime';
        console.warn('[UnityBridge] Launch error:', errorMsg);
        return {
            success: false,
            error: errorMsg
        };
    }
};

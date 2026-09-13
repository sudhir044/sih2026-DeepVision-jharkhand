import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function ARCameraView({
  children,
  isScanning = false,
  hazardType = 'fire',
  onViewportTap,
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasCameraAccess, setHasCameraAccess] = useState(false);

  // Scan line & HUD matrix animations
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cameraGrainAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Auto-request camera permissions on mount
    async function initCamera() {
      if (permission?.granted) {
        setHasCameraAccess(true);
      } else {
        const res = await requestPermission();
        if (res?.granted) {
          setHasCameraAccess(true);
        }
      }
    }
    initCamera();
  }, [permission]);

  useEffect(() => {
    // Laser scan animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse target reticle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulated camera sensor flicker
    Animated.loop(
      Animated.sequence([
        Animated.timing(cameraGrainAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cameraGrainAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.4],
  });

  const grainOpacity = cameraGrainAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.03, 0.08],
  });

  return (
    <View style={styles.container}>
      {/* Real Live Device Camera Feed */}
      {hasCameraAccess ? (
        <CameraView style={StyleSheet.absoluteFillObject} facing="back" />
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.simulatedCameraView}
          onPress={onViewportTap}
        >
          {/* Animated Camera Sensor Background */}
          <Animated.View
            style={[
              styles.cameraSensorOverlay,
              { opacity: grainOpacity },
            ]}
          />
          <Text style={styles.cameraSimEmoji}>📷 🏭</Text>

          {!permission?.granted && (
            <TouchableOpacity
              style={styles.grantCameraBtn}
              onPress={requestPermission}
            >
              <Text style={styles.grantCameraText}>
                📷 Tap to Enable Live Camera Feed
              </Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}

      {/* AR HUD Overlay Layer */}
      <View style={styles.hudOverlay} pointerEvents="box-none">
        {/* AR Floor Mesh Grid */}
        <View style={styles.gridMatrix} pointerEvents="none">
          <View style={styles.gridRow} />
          <View style={styles.gridRow} />
          <View style={styles.gridRow} />
          <Animated.View
            style={[styles.laserScanLine, { transform: [{ translateY }] }]}
          />
        </View>

        {/* Children Controls & Spatial Objects */}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  simulatedCameraView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraSensorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#38BDF8',
  },
  cameraSimEmoji: {
    fontSize: 90,
    opacity: 0.15,
  },
  grantCameraBtn: {
    position: 'absolute',
    top: 60,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  grantCameraText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  hudOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  gridMatrix: {
    position: 'absolute',
    top: height * 0.2,
    left: 20,
    right: 20,
    height: height * 0.45,
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 0, 0.25)',
    borderRadius: 20,
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(255, 90, 0, 0.02)',
  },
  gridRow: {
    height: 1,
    backgroundColor: 'rgba(255, 90, 0, 0.15)',
  },
  laserScanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});

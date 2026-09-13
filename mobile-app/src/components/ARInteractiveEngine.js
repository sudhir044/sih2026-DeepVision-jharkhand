import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function ARInteractiveEngine({
  children,
  hazardType = 'fire', // 'fire' | 'gas'
  hazardLevel = 100, // 0 to 100
  isSpraying = false,
  stepNumber = 1,
  totalSteps = 7,
  onAnchorTap,
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasCameraAccess, setHasCameraAccess] = useState(false);

  // Animations
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (permission?.granted) {
      setHasCameraAccess(true);
    }
  }, [permission]);

  useEffect(() => {
    // Scanning reticle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse target animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (isSpraying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particleAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(particleAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      particleAnim.setValue(0);
    }
  }, [isSpraying]);

  const handleGrantCamera = async () => {
    const res = await requestPermission();
    if (res.granted) setHasCameraAccess(true);
  };

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const particleY = particleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  const particleOpacity = particleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.9, 0.5, 0],
  });

  return (
    <View style={styles.container}>
      {/* Real Expo Camera Feed or Realistic AR Viewport */}
      {hasCameraAccess ? (
        <CameraView style={StyleSheet.absoluteFillObject} facing="back" />
      ) : (
        <View style={styles.simulatedViewport}>
          <Text style={styles.bgIndustrialEmoji}>🏭</Text>
          {permission && !permission.granted && (
            <TouchableOpacity
              style={styles.cameraBanner}
              onPress={handleGrantCamera}
              activeOpacity={0.8}
            >
              <Text style={styles.cameraBannerText}>
                📷 Tap to turn on real smartphone camera feed for AR
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* AR HUD Layers */}
      <View style={styles.hudOverlay} pointerEvents="box-none">
        {/* Top AR Telemetry Bar */}
        <View style={styles.topTelemetryBar}>
          <View style={styles.telemetryBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.telemetryText}>
              ARCORE 3D SPATIAL ANCHOR
            </Text>
          </View>

          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>
              STEP {stepNumber} OF {totalSteps}
            </Text>
          </View>
        </View>

        {/* Spatial Target Anchor */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.spatialTargetBox}
          onPress={onAnchorTap}
        >
          <Animated.View
            style={[
              styles.targetRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.centerDot} />
          </Animated.View>
          <Text style={styles.targetStatusText}>
            {hazardType === 'fire'
              ? hazardLevel > 0
                ? `🔥 FIRE HAZARD (${hazardLevel}%)`
                : '✅ FIRE EXTINGUISHED'
              : `⚠️ TOXIC GAS (PPM: ${hazardLevel * 4.5})`}
          </Text>
        </TouchableOpacity>

        {/* Extinguisher Spray Particles Effect */}
        {isSpraying && (
          <View style={styles.sprayContainer} pointerEvents="none">
            <Animated.View
              style={[
                styles.particleCloud,
                {
                  transform: [{ translateY: particleY }, { scale: 1.5 }],
                  opacity: particleOpacity,
                },
              ]}
            >
              <Text style={styles.particleEmoji}>💨 ☁️ 💨</Text>
            </Animated.View>
          </View>
        )}

        {/* AR Floor Mesh Grid */}
        <View style={styles.floorGrid}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <Animated.View
            style={[styles.laserScanner, { transform: [{ translateY }] }]}
          />
        </View>

        {/* Children Overlay Controls */}
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
  simulatedViewport: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgIndustrialEmoji: {
    fontSize: 160,
    opacity: 0.08,
  },
  cameraBanner: {
    position: 'absolute',
    top: 54,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cameraBannerText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  hudOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topTelemetryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  telemetryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  telemetryText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stepBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stepBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  spatialTargetBox: {
    position: 'absolute',
    top: height * 0.28,
    alignSelf: 'center',
    alignItems: 'center',
  },
  targetRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 90, 0, 0.12)',
    marginBottom: 12,
  },
  centerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
  targetStatusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sprayContainer: {
    position: 'absolute',
    top: height * 0.38,
    alignSelf: 'center',
    alignItems: 'center',
  },
  particleCloud: {
    alignItems: 'center',
  },
  particleEmoji: {
    fontSize: 48,
  },
  floorGrid: {
    position: 'absolute',
    bottom: 140,
    left: 30,
    right: 30,
    height: 180,
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 0, 0.25)',
    borderRadius: 16,
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(255, 90, 0, 0.02)',
  },
  gridLine: {
    height: 1,
    backgroundColor: 'rgba(255, 90, 0, 0.15)',
  },
  laserScanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
});

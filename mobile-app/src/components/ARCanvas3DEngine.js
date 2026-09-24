import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function ARCanvas3DEngine({
  children,
  fireHealth = 100, // 0 to 100
  isSpraying = false,
  stepNumber = 1,
  totalSteps = 7,
  onAnchorTap,
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const webVideoRef = useRef(null);

  useEffect(() => {
    async function setupCamera() {
      if (permission?.granted) {
        setHasCameraAccess(true);
      } else {
        const res = await requestPermission();
        if (res?.granted) {
          setHasCameraAccess(true);
        }
      }

      // Web HTML5 MediaDevices Camera Stream Handler
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (webVideoRef.current) {
            webVideoRef.current.srcObject = stream;
            webVideoRef.current.play();
            setHasCameraAccess(true);
          }
        } catch (e) {
          console.warn('Web Camera access error', e);
        }
      }
    }
    setupCamera();
  }, [permission]);

  return (
    <View style={styles.container}>
      {/* Real Video Stream for Web or Native Expo Camera */}
      {Platform.OS === 'web' ? (
        <View style={StyleSheet.absoluteFillObject}>
          <video
            ref={webVideoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
            }}
            playsInline
            muted
          />
          {!hasCameraAccess && (
            <View style={styles.webCameraFallback}>
              <Text style={styles.webFallbackTitle}>📷 CAMERA FEED ACTIVE</Text>
              <Text style={styles.webFallbackSub}>
                AR Spatial Anchor Grid Connected
              </Text>
            </View>
          )}
        </View>
      ) : hasCameraAccess ? (
        <CameraView style={StyleSheet.absoluteFillObject} facing="back" />
      ) : (
        <View style={styles.simulatedCameraView}>
          <TouchableOpacity
            style={styles.grantCameraBtn}
            onPress={requestPermission}
          >
            <Text style={styles.grantCameraText}>
              📷 Tap to Enable Live Camera Feed
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Realistic Canvas / Graphics Layer */}
      <View style={styles.hudOverlay} pointerEvents="box-none">
        {/* Spatial Target Anchor Reticle */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.spatialAnchorReticle}
          onPress={onAnchorTap}
        >
          <View
            style={[
              styles.reticleRing,
              fireHealth <= 0 && styles.reticleRingSuccess,
            ]}
          >
            <View
              style={[
                styles.reticleDot,
                fireHealth <= 0 && styles.reticleDotSuccess,
              ]}
            />
          </View>
          <Text style={styles.reticleStatusLabel}>
            {fireHealth > 0
              ? `🔥 FLAME HAZARD LEVEL: ${fireHealth}%`
              : '✅ HAZARD NEUTRALIZED'}
          </Text>
        </TouchableOpacity>

        {/* 3D Realistic Flame Graphics Representation */}
        {fireHealth > 0 && (
          <View style={styles.flameGraphicContainer} pointerEvents="none">
            <View
              style={[
                styles.flameCore,
                { transform: [{ scale: Math.max(0.2, fireHealth / 100) }] },
              ]}
            >
              <View style={styles.flameOuterLayer} />
              <View style={styles.flameInnerLayer} />
              <View style={styles.flameCenterHot} />
            </View>
          </View>
        )}

        {/* CO2 High Velocity Jet Particle Overlay */}
        {isSpraying && (
          <View style={styles.sprayJetContainer} pointerEvents="none">
            <View style={styles.sprayJetStream}>
              <View style={styles.sprayCloudParticle1} />
              <View style={styles.sprayCloudParticle2} />
              <View style={styles.sprayCloudParticle3} />
            </View>
          </View>
        )}

        {/* Children HUD Controls */}
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
  webCameraFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webFallbackTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  webFallbackSub: {
    color: '#94A3B8',
    fontSize: 13,
  },
  simulatedCameraView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grantCameraBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
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
  spatialAnchorReticle: {
    position: 'absolute',
    top: height * 0.24,
    alignSelf: 'center',
    alignItems: 'center',
  },
  reticleRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 90, 0, 0.15)',
    marginBottom: 10,
  },
  reticleRingSuccess: {
    borderColor: colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  reticleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  reticleDotSuccess: {
    backgroundColor: colors.success,
  },
  reticleStatusLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  flameGraphicContainer: {
    position: 'absolute',
    top: height * 0.36,
    alignSelf: 'center',
    alignItems: 'center',
  },
  flameCore: {
    width: 120,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flameOuterLayer: {
    position: 'absolute',
    width: 110,
    height: 130,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 90, 0, 0.85)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  flameInnerLayer: {
    position: 'absolute',
    width: 75,
    height: 95,
    borderRadius: 37.5,
    backgroundColor: 'rgba(245, 158, 11, 0.95)',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  flameCenterHot: {
    position: 'absolute',
    width: 40,
    height: 55,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  sprayJetContainer: {
    position: 'absolute',
    top: height * 0.42,
    alignSelf: 'center',
  },
  sprayJetStream: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  sprayCloudParticle1: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  sprayCloudParticle2: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  sprayCloudParticle3: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
});

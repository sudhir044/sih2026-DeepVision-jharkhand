import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import ARCameraView from '../components/ARCameraView';
import { colors } from '../theme/colors';
import { translations } from '../i18n/translations';

export default function CertificateVerificationScreen({
  onBackHome,
  lang = 'en',
  onToggleLang,
}) {
  const t = translations[lang] || translations.en;
  const [isScanningMode, setIsScanningMode] = useState(false);

  const details = [
    { label: t.certId.replace(': {{id}}', ''), value: 'SAFE-2026-001024' },
    { label: t.worker, value: 'Ramesh Kumar' },
    { label: t.trainingModule, value: 'Fire & Explosion Response' },
    { label: t.score, value: '86/100' },
    { label: t.completionDate.replace(': {{date}}', ''), value: '10 Sep 2026' },
    { label: t.status, value: 'PASSED' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />

      {isScanningMode ? (
        <View style={styles.cameraScanView}>
          <ARCameraView hazardType="fire">
            <View style={styles.scannerOverlay}>
              <View style={styles.scanHeader}>
                <TouchableOpacity
                  style={styles.closeScanBtn}
                  onPress={() => setIsScanningMode(false)}
                >
                  <Text style={styles.closeScanText}>‹ {t.back}</Text>
                </TouchableOpacity>
                <Text style={styles.scanTitle}>{t.scanQrCamera}</Text>
              </View>

              <View style={styles.qrTargetBox}>
                <View style={styles.qrCornerTL} />
                <View style={styles.qrCornerTR} />
                <View style={styles.qrCornerBL} />
                <View style={styles.qrCornerBR} />
              </View>

              <TouchableOpacity
                style={styles.simulateScanBtn}
                onPress={() => setIsScanningMode(false)}
              >
                <Text style={styles.simulateScanText}>
                  ✓ QR Code Detected (Tap to verify)
                </Text>
              </TouchableOpacity>
            </View>
          </ARCameraView>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerBar}>
            {onBackHome ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackHome}
                activeOpacity={0.7}
              >
                <Text style={styles.backText}>‹ {t.backToHome}</Text>
              </TouchableOpacity>
            ) : <View />}

            <View style={styles.headerRightGroup}>
              {onToggleLang && (
                <TouchableOpacity
                  style={styles.langToggle}
                  onPress={onToggleLang}
                >
                  <Text style={styles.langText}>
                    {lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 EN'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Status Banner */}
          <View style={styles.statusBanner}>
            <Text style={styles.statusBannerText}>✓ {t.certValid}</Text>
          </View>

          {/* Scan QR Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.scanQrButton}
            onPress={() => setIsScanningMode(true)}
          >
            <Text style={styles.scanQrButtonText}>📷 {t.scanQrCamera}</Text>
          </TouchableOpacity>

          {/* Details Table Card */}
          <View style={styles.tableCard}>
            {details.map((item, index) => {
              const isLast = index === details.length - 1;
              return (
                <View
                  key={item.label}
                  style={[styles.tableRow, isLast && styles.lastRow]}
                >
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowValue}>{item.value}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  langToggle: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langText: {
    color: colors.textDark,
    fontSize: 12,
    fontWeight: '700',
  },
  statusBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBannerText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scanQrButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanQrButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  tableCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '400',
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'right',
  },

  // Camera Scan Mode
  cameraScanView: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  scanHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeScanBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 16,
  },
  closeScanText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  scanTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  qrTargetBox: {
    width: 220,
    height: 220,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    position: 'relative',
  },
  qrCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 24,
    height: 24,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: colors.primary,
  },
  qrCornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: colors.primary,
  },
  qrCornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 24,
    height: 24,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: colors.primary,
  },
  qrCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: colors.primary,
  },
  simulateScanBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  simulateScanText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

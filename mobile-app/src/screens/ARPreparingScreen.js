import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import ARCameraView from '../components/ARCameraView';
import { colors } from '../theme/colors';
import { translations } from '../i18n/translations';

export default function ARPreparingScreen({
  onBack,
  onStartSimulation,
  lang = 'en',
  onToggleLang,
}) {
  const t = translations[lang] || translations.en;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBg} />

      {/* Camera Feed Background View */}
      <ARCameraView isScanning hazardType="fire">
        {/* Top Header Navigation */}
        <View style={styles.topHeader}>
          {onBack && (
            <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
              <Text style={styles.backText}>‹ {t.back}</Text>
            </TouchableOpacity>
          )}

          {/* Language Toggle Button */}
          {onToggleLang && (
            <TouchableOpacity
              style={styles.langToggle}
              onPress={onToggleLang}
              activeOpacity={0.8}
            >
              <Text style={styles.langText}>
                {lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 EN'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Center Prompt & Action Overlay */}
        <View style={styles.centerOverlay}>
          <Text style={styles.title}>{t.preparingAr}</Text>
          <Text style={styles.description}>{t.scanFloor}</Text>
          <Text style={styles.note}>{t.unrealIntegration}</Text>

          {/* Main Launch Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.demoButton}
            onPress={onStartSimulation}
          >
            <Text style={styles.demoButtonText}>{t.demoArButton}</Text>
          </TouchableOpacity>

          <Text style={styles.footerDisclaimer}>{t.simulatedDisclaimer}</Text>
        </View>
      </ARCameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    color: colors.textLightMuted,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  langToggle: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  langText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  centerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 44,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  description: {
    fontSize: 14,
    color: colors.textLightMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  note: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  demoButton: {
    backgroundColor: colors.primary,
    height: 54,
    width: '100%',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  demoButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  footerDisclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

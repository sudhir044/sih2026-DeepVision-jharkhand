import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storage';

export default function ScoreScreen({
  results = {
    score: 86,
    correctActions: 7,
    wrongActions: 2,
    safetyViolations: 1,
    timeTaken: '02:14',
    moduleTitle: 'Fire & Explosion Response',
  },
  onViewCertificate,
  onRetry,
  onBackToHome,
  lang = 'en',
  onToggleLang,
}) {
  const t = translations[lang] || translations.en;
  const isPassed = results.score >= 70;

  useEffect(() => {
    // Persist session log to storage
    async function persistResult() {
      const newLog = {
        id: `log-${Date.now()}`,
        module: results.moduleTitle || 'Fire & Explosion Response',
        score: results.score,
        status: isPassed ? 'PASSED' : 'FAILED',
        correctActions: results.correctActions,
        wrongActions: results.wrongActions,
        safetyViolations: results.safetyViolations,
        timeTaken: results.timeTaken,
        date: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        certificateId: `SAFE-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        synced: true,
      };
      await storageService.saveTrainingResult(newLog);
    }
    persistResult();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header & Language Toggle */}
        <View style={styles.topHeader}>
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

        {/* Status Badge */}
        <View
          style={[
            styles.badge,
            !isPassed && { backgroundColor: '#FEE2E2' },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              !isPassed && { color: colors.danger },
            ]}
          >
            {isPassed ? `✓ ${t.passed}` : `✕ ${t.failed}`}
          </Text>
        </View>

        {/* Large Score */}
        <Text style={styles.scoreText}>{results.score}/100</Text>
        <Text style={styles.moduleSubtitle}>
          {results.moduleTitle || t.fireModuleTitle}
        </Text>

        {/* Score Breakdown Table Card */}
        <View style={styles.card}>
          {/* Row 1: Correct Actions */}
          <View style={styles.tableRow}>
            <Text style={styles.rowLabel}>{t.correctActions}</Text>
            <Text style={[styles.rowValue, styles.valueGreen]}>
              {results.correctActions}
            </Text>
          </View>

          {/* Row 2: Wrong Actions */}
          <View style={styles.tableRow}>
            <Text style={styles.rowLabel}>{t.wrongActions}</Text>
            <Text style={[styles.rowValue, styles.valueRed]}>
              {results.wrongActions}
            </Text>
          </View>

          {/* Row 3: Safety Violations */}
          <View style={styles.tableRow}>
            <Text style={styles.rowLabel}>{t.safetyViolations}</Text>
            <Text style={[styles.rowValue, styles.valueRed]}>
              {results.safetyViolations}
            </Text>
          </View>

          {/* Row 4: Time Taken */}
          <View style={[styles.tableRow, styles.lastRow]}>
            <Text style={styles.rowLabel}>{t.timeTaken}</Text>
            <Text style={[styles.rowValue, styles.valueDark]}>
              {results.timeTaken}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          {/* Primary Orange: View Certificate */}
          {isPassed && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.primaryButton}
              onPress={onViewCertificate}
            >
              <Text style={styles.primaryButtonText}>{t.viewCertificate}</Text>
            </TouchableOpacity>
          )}

          {/* Secondary Outline: Retry Training */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.secondaryButton}
            onPress={onRetry}
          >
            <Text style={styles.secondaryButtonText}>{t.retryTraining}</Text>
          </TouchableOpacity>

          {/* Secondary Outline: Back to Home */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.secondaryButton}
            onPress={onBackToHome}
          >
            <Text style={styles.secondaryButtonText}>{t.backToHome}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  topHeader: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 12,
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
  badge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  scoreText: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  moduleSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 28,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
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
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  valueGreen: {
    color: colors.success,
  },
  valueRed: {
    color: colors.danger,
  },
  valueDark: {
    color: colors.textDark,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },
});

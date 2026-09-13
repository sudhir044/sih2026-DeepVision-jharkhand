import React, { useEffect, useState } from 'react';
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

export default function HomeScreen({
  onSelectModule,
  lang = 'en',
  onToggleLang,
}) {
  const t = translations[lang] || translations.en;
  const [completedCount, setCompletedCount] = useState(3);
  const [certCount, setCertCount] = useState(3);

  useEffect(() => {
    async function loadStats() {
      const logs = await storageService.getCompletedTrainings();
      setCompletedCount(logs.length);
      setCertCount(logs.filter((l) => l.status === 'PASSED').length);
    }
    loadStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header & Language Toggle */}
        <View style={styles.topBar}>
          <View style={styles.syncBadge}>
            <View style={styles.syncDot} />
            <Text style={styles.syncText}>{t.offlineStatus}</Text>
          </View>

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

        {/* User Profile / Greeting Section */}
        <View style={styles.header}>
          <Text style={styles.greetingTitle}>{t.greeting}</Text>
          <Text style={styles.greetingSubtitle}>{t.unit}</Text>
        </View>

        {/* Stats Section (2 Cards) */}
        <View style={styles.statsRow}>
          {/* Card 1: Trainings Completed */}
          <View style={[styles.statCard, { backgroundColor: colors.cardBlueBg }]}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>{t.trainingsCompleted}</Text>
          </View>

          {/* Card 2: Certificates Earned */}
          <View style={[styles.statCard, { backgroundColor: colors.cardGreenBg }]}>
            <Text style={styles.statNumber}>{certCount}</Text>
            <Text style={styles.statLabel}>{t.certificatesEarned}</Text>
          </View>
        </View>

        {/* Continue Training Primary Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.continueButton}
          onPress={() => onSelectModule('fire')}
        >
          <Text style={styles.continueButtonText}>{t.continueTraining}</Text>
        </TouchableOpacity>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>{t.availableModules}</Text>

        {/* Module List */}
        <View style={styles.moduleList}>
          {/* Module 1: Fire & Explosion Response */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.moduleCard}
            onPress={() => onSelectModule('fire')}
          >
            <Text style={styles.moduleIcon}>🔥</Text>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleTitle}>{t.fireModuleTitle}</Text>
              <Text style={styles.moduleMeta}>{t.fireModuleMeta}</Text>
            </View>
          </TouchableOpacity>

          {/* Module 2: Gas Leak & Confined Space */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.moduleCard}
            onPress={() => onSelectModule('gas')}
          >
            <Text style={styles.moduleIcon}>🛢️</Text>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleTitle}>{t.gasModuleTitle}</Text>
              <Text style={styles.moduleMeta}>{t.gasModuleMeta}</Text>
            </View>
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
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  syncText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
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
  header: {
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 20,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  moduleList: {
    gap: 14,
  },
  moduleCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleIcon: {
    fontSize: 26,
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  moduleMeta: {
    fontSize: 13,
    color: colors.textMuted,
  },
});

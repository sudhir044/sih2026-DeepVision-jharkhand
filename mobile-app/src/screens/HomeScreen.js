import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { translations } from '../i18n/translations';
import { storageService } from '../services/storage';

const { width } = Dimensions.get('window');

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
        <View style={styles.webWrapper}>
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
                activeOpacity={0.7}
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
            activeOpacity={0.8}
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
              activeOpacity={0.8}
              style={styles.moduleCard}
              onPress={() => onSelectModule('fire')}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.moduleIcon}>🔥</Text>
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{t.fireModuleTitle}</Text>
                <Text style={styles.moduleMeta}>{t.fireModuleMeta}</Text>
              </View>
              <View style={styles.chevron}>
                <Text style={styles.chevronText}>›</Text>
              </View>
            </TouchableOpacity>

            {/* Module 2: Gas Leak & Confined Space */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.moduleCard}
              onPress={() => onSelectModule('gas')}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.moduleIcon}>🛢️</Text>
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{t.gasModuleTitle}</Text>
                <Text style={styles.moduleMeta}>{t.gasModuleMeta}</Text>
              </View>
              <View style={styles.chevron}>
                <Text style={styles.chevronText}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
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
  webWrapper: {
    width: '100%',
    alignSelf: 'center',
    maxWidth: Platform.OS === 'web' ? 600 : '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  syncText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  langToggle: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  langText: {
    color: colors.textDark,
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    marginBottom: 32,
  },
  greetingTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  greetingSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  moduleList: {
    gap: 16,
  },
  moduleCard: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleIcon: {
    fontSize: 24,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  moduleMeta: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  chevron: {
    paddingLeft: 10,
  },
  chevronText: {
    fontSize: 24,
    color: '#CBD5E1',
    fontWeight: '300',
  },
});

import React from 'react';
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

export default function ModuleDetailScreen({
  moduleType = 'fire',
  onBack,
  onStartAR,
  lang = 'en',
  onToggleLang,
}) {
  const t = translations[lang] || translations.en;
  const isFire = moduleType === 'fire';

  const practiceItems = isFire
    ? [
        lang === 'hi' ? 'अग्नि खतरों की पहचान करें' : 'Identify fire hazards',
        lang === 'hi' ? 'आपातकालीन अलार्म बजाएं' : 'Raise emergency alarm',
        lang === 'hi' ? 'सही अग्निशामक का चयन करें' : 'Select correct extinguisher',
        lang === 'hi' ? 'सुरक्षित दूरी बनाए रखें' : 'Maintain safe distance',
        lang === 'hi' ? 'आग को सुरक्षित रूप से बुझाएं' : 'Extinguish fire safely',
        lang === 'hi' ? 'आपातकालीन निकास बिंदु खोजें' : 'Identify emergency exit',
        lang === 'hi' ? 'सुरक्षित स्थान पर खाली करें' : 'Evacuate safely',
      ]
    : [
        lang === 'hi' ? 'गैस रिसाव स्रोतों की पहचान करें' : 'Identify gas hazard sources',
        lang === 'hi' ? 'आवश्यक पीपीई गियर चुनें' : 'Select required PPE gear',
        lang === 'hi' ? 'बडी-सिस्टम प्रक्रिया करें' : 'Perform Buddy-System setup',
        lang === 'hi' ? 'वायुमंडलीय गैस स्तरों की निगरानी करें' : 'Monitor atmospheric gas levels',
        lang === 'hi' ? 'सीमित स्थान में सुरक्षित प्रवेश' : 'Safe confined space entry',
        lang === 'hi' ? 'आपातकालीन अलगाव प्रक्रिया' : 'Emergency isolation procedure',
        lang === 'hi' ? 'सुरक्षित रूप से बाहर निकलें' : 'Evacuate safely',
      ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkHeaderBg} />

      {/* Top Banner Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.topNavRow}>
          {onBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backText}>‹ {t.back}</Text>
            </TouchableOpacity>
          ) : <View />}

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

        <Text style={styles.headerIcon}>{isFire ? '🔥' : '🛢️'}</Text>
        <Text style={styles.headerTitle}>
          {isFire ? t.fireModuleTitle : t.gasModuleTitle}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isFire ? t.fireModuleMeta : t.gasModuleMeta}
        </Text>
      </View>

      {/* Main Body Content */}
      <ScrollView
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeading}>{t.whatYouWillPractice}</Text>

        {/* Practice Checklist */}
        <View style={styles.listContainer}>
          {practiceItems.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.orangeDot} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Button */}
      <View style={styles.bottomFooter}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.startButton}
          onPress={onStartAR}
        >
          <Text style={styles.startButtonText}>{t.startArTraining}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  headerCard: {
    backgroundColor: colors.darkHeaderBg,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    color: colors.textLightMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  langToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  headerIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textLightMuted,
  },
  bodyContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 20,
  },
  listContainer: {
    gap: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orangeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.bulletOrange,
    marginRight: 14,
  },
  listText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '400',
  },
  bottomFooter: {
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 12,
    backgroundColor: colors.lightBg,
  },
  startButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

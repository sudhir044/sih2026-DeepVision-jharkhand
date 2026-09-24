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
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../theme/colors';
import { translations } from '../i18n/translations';

export default function CertificateScreen({
  onVerify,
  onBack,
  lang = 'en',
  onToggleLang,
  certData = {
    workerName: 'Ramesh Kumar',
    moduleTitle: 'Fire & Explosion Response',
    score: 86,
    certId: 'SAFE-2026-001024',
    date: '10 Sep 2026',
  },
}) {
  const t = translations[lang] || translations.en;
  const qrPayload = JSON.stringify({
    id: certData.certId,
    worker: certData.workerName,
    module: certData.moduleTitle,
    score: certData.score,
    date: certData.date,
    issuer: 'Dept of Higher & Technical Education, Jharkhand',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View style={styles.headerBar}>
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

        {/* Certificate Golden Bordered Card */}
        <View style={styles.certCard}>
          <Text style={styles.certHeaderTitle}>🥇 {t.certTitle}</Text>

          <Text style={styles.workerName}>{certData.workerName}</Text>

          <Text style={styles.certDescription}>
            {t.hasCompleted}{'\n'}
            {certData.moduleTitle}
          </Text>

          <Text style={styles.scoreText}>
            {t.scoreLabel.replace('{{score}}', certData.score)}
          </Text>

          {/* Real SVG QR Code Container */}
          <View style={styles.qrCodeBox}>
            <QRCode
              value={qrPayload}
              size={110}
              color="#0F172A"
              backgroundColor="#FFFFFF"
            />
          </View>

          {/* Metadata */}
          <Text style={styles.certMeta}>
            {t.certId.replace('{{id}}', certData.certId)}
          </Text>
          <Text style={styles.certMeta}>
            {t.completionDate.replace('{{date}}', certData.date)}
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.verifyButton}
          onPress={onVerify}
        >
          <Text style={styles.verifyButtonText}>{t.verifyCertificate}</Text>
        </TouchableOpacity>
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
  certCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#D97706',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  certHeaderTitle: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 16,
    textAlign: 'center',
  },
  workerName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  certDescription: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 20,
  },
  qrCodeBox: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  certMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { translations } from '../i18n/translations';

const { width } = Dimensions.get('window');

export default function LoginScreen({ onLogin, lang = 'en', onToggleLang }) {
  const t = translations[lang] || translations.en;
  
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ employeeId: '', password: '' });
  const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = () => {
    let isValid = true;
    const newErrors = { employeeId: '', password: '' };

    if (!employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      onLogin();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightBg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.webContainer}>
          {/* Language Toggle Header */}
          <View style={styles.topNav}>
            {onToggleLang && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.langToggle}
                onPress={onToggleLang}
              >
                <Text style={styles.langText}>
                  {lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 EN'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Header Title & Subtitle */}
          <View style={styles.header}>
            <Text style={styles.title}>{t.employeeLogin}</Text>
            <Text style={styles.subtitle}>{t.signInSubtitle}</Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.form}>
            {/* Employee ID Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.employeeId}</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'employeeId' && styles.inputFocused,
                  errors.employeeId && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="e.g. W1024"
                  placeholderTextColor="#A0AEC0"
                  value={employeeId}
                  onChangeText={(text) => {
                    setEmployeeId(text);
                    if (errors.employeeId) setErrors({ ...errors, employeeId: '' });
                  }}
                  autoCapitalize="characters"
                  onFocus={() => setFocusedInput('employeeId')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {errors.employeeId ? (
                <Text style={styles.errorText}>{errors.employeeId}</Text>
              ) : null}
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.password}</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === 'password' && styles.inputFocused,
                  errors.password && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#A0AEC0"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>{t.loginButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center',
  },
  webContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    width: '100%',
    alignSelf: 'center',
    maxWidth: Platform.OS === 'web' ? 440 : '100%', // Responsive for web
    justifyContent: 'center',
  },
  topNav: {
    position: 'absolute',
    top: 20,
    right: 24,
    zIndex: 10,
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
    marginBottom: 40,
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  inputFocused: {
    borderColor: colors.primary,
    shadowOpacity: 0.1,
    shadowColor: colors.primary,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textDark,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

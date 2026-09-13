import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { register } from "../services/auth";
import { useLanguage } from "../i18n/LanguageContext";

export default function SignupScreen() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert(
        t.signup.missingDetails,
        t.signup.enterAllFields
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t.signup.missingDetails,
        t.signup.passwordsDontMatch
      );
      return;
    }

    try {
      setLoading(true);

      await register(name.trim(), email.trim(), password);

      router.replace("/home");
    } catch (error) {
      console.error("SIGNUP FAILED:", error);

      Alert.alert(
        t.signup.signupFailed,
        error instanceof Error
          ? error.message
          : "Unable to complete registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← {t.common.back}</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            DEEP<Text style={styles.orange}>VISION</Text>
          </Text>
          <Text style={styles.subtitle}>{t.hero.badge}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>{t.signup.title}</Text>
          <Text style={styles.subheading}>{t.signup.subtitle}</Text>

          {/* Full Name */}
          <Text style={styles.label}>{t.signup.name}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.signup.namePlaceholder}
            placeholderTextColor="#777"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          {/* Email */}
          <Text style={styles.label}>{t.signup.email}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.signup.emailPlaceholder}
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Password */}
          <Text style={styles.label}>{t.signup.password}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.signup.passwordPlaceholder}
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Confirm Password */}
          <Text style={styles.label}>{t.signup.confirmPassword}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.signup.confirmPasswordPlaceholder}
            placeholderTextColor="#777"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.signupButton, loading && styles.buttonDisabled]}
            disabled={loading}
            onPress={handleSignup}
          >
            <Text style={styles.signupText}>
              {loading ? t.signup.signingUp : t.signup.signupButton}
            </Text>
          </TouchableOpacity>

          {/* Link to Login */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.linkText}>
              {t.signup.alreadyHaveAccount}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>{t.hero.government}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050606",
  },

  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 55,
    paddingBottom: 40,
    justifyContent: "center",
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    paddingVertical: 6,
  },

  backText: {
    color: "#ff8a00",
    fontSize: 15,
    fontWeight: "700",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
  },

  orange: {
    color: "#ff8a00",
  },

  subtitle: {
    color: "#A0A0A0",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 6,
  },

  form: {
    width: "100%",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },

  subheading: {
    color: "#888888",
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
  },

  label: {
    color: "#D0D0D0",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    height: 50,
    backgroundColor: "#101212",
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    marginBottom: 14,
    fontSize: 14,
  },

  signupButton: {
    height: 52,
    backgroundColor: "#ff8a00",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 14,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  signupText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  linkButton: {
    alignItems: "center",
    paddingVertical: 10,
  },

  linkText: {
    color: "#ff8a00",
    fontSize: 13,
    fontWeight: "600",
  },

  footer: {
    color: "#555555",
    fontSize: 10,
    textAlign: "center",
    marginTop: 25,
    letterSpacing: 0.8,
  },
});

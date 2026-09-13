import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { login } from "../services/auth";
import { useLanguage } from "../i18n/LanguageContext";

export default function LoginScreen() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        t.login.missingDetails,
        t.login.enterCredentials
      );
      return;
    }

    try {
      setLoading(true);

      const data = await login(email.trim(), password);

      console.log("LOGIN SUCCESS:", data.user);

      router.replace("/home");
    } catch (error) {
      console.error("LOGIN FAILED:", error);

      Alert.alert(
        t.login.loginFailed,
        error instanceof Error
          ? error.message
          : "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← {t.common.back}</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>DEEP<Text style={styles.orange}>VISION</Text></Text>
        <Text style={styles.subtitle}>
          {t.hero.badge}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>{t.login.title}</Text>
        <Text style={styles.subheading}>{t.login.subtitle}</Text>

        <Text style={styles.label}>{t.login.email}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.login.emailPlaceholder}
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>{t.login.password}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.login.passwordPlaceholder}
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>
            {loading ? t.login.loggingIn : t.login.login}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.linkText}>
            {t.login.dontHaveAccount}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        {t.hero.government}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050606",
    paddingHorizontal: 28,
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    top: 55,
    left: 24,
    zIndex: 10,
    padding: 8,
  },

  backText: {
    color: "#ff8a00",
    fontSize: 15,
    fontWeight: "700",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
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
    fontSize: 12,
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
    fontSize: 14,
    marginBottom: 24,
  },

  label: {
    color: "#D0D0D0",
    fontSize: 14,
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: "#101212",
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    marginBottom: 18,
  },

  loginButton: {
    height: 54,
    backgroundColor: "#ff8a00",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  loginText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  linkButton: {
    alignItems: "center",
    paddingVertical: 14,
  },

  linkText: {
    color: "#ff8a00",
    fontSize: 13,
    fontWeight: "600",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    color: "#555555",
    fontSize: 10,
    letterSpacing: 0.8,
  },
});

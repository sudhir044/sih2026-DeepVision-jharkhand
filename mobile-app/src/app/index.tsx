import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useLanguage } from "../i18n/LanguageContext";

export default function HeroScreen() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar: Brand + Language Selector */}
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>D</Text>
            </View>

            <Text style={styles.brandName}>
              DEEP<Text style={styles.orange}>VISION</Text>
            </Text>
          </View>

          <View style={styles.languageSelector}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === "EN" && styles.languageActive,
              ]}
              onPress={() => setLanguage("EN")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "EN" && styles.languageActiveText,
                ]}
              >
                EN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                language === "HI" && styles.languageActive,
              ]}
              onPress={() => setLanguage("HI")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "HI" && styles.languageActiveText,
                ]}
              >
                हिंदी
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                language === "SAT" && styles.languageActive,
              ]}
              onPress={() => setLanguage("SAT")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "SAT" && styles.languageActiveText,
                ]}
              >
                संताली
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.badge}>
            {t.hero.badge}
          </Text>

          <Text style={styles.title}>
            {t.hero.title1}
          </Text>

          <Text style={styles.titleOrange}>
            {t.hero.title2}
          </Text>

          <Text style={styles.description}>
            {t.hero.description}
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.features}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>◉</Text>
            <Text style={styles.featureTitle}>
              AR Training
            </Text>
            <Text style={styles.featureText}>
              Practice real workplace safety scenarios.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureTitle}>
              Assessments
            </Text>
            <Text style={styles.featureText}>
              Test your safety knowledge and actions.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>▣</Text>
            <Text style={styles.featureTitle}>
              Certification
            </Text>
            <Text style={styles.featureText}>
              Earn verifiable digital certificates.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.primaryText}>
            {t.hero.getStarted}
          </Text>

          <Text style={styles.arrow}>
            →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginText}>
            {t.hero.existingAccount}
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          {t.hero.government}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 35,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 45,
    flexWrap: "wrap",
    gap: 12,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  languageSelector: {
    flexDirection: "row",
    backgroundColor: "#151515",
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: "#292929",
  },

  languageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },

  languageActive: {
    backgroundColor: "#ff8a00",
  },

  languageText: {
    color: "#999999",
    fontSize: 11,
    fontWeight: "700",
  },

  languageActiveText: {
    color: "#000000",
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#ff8a00",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  logoText: {
    color: "#000000",
    fontSize: 25,
    fontWeight: "900",
  },

  brandName: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  orange: {
    color: "#ff8a00",
  },

  hero: {
    marginBottom: 35,
  },

  badge: {
    color: "#ff8a00",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 18,
  },

  title: {
    color: "#ffffff",
    fontSize: 43,
    lineHeight: 48,
    fontWeight: "900",
  },

  titleOrange: {
    color: "#ff8a00",
    fontSize: 43,
    lineHeight: 48,
    fontWeight: "900",
    marginBottom: 18,
  },

  description: {
    color: "#a5a5a5",
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 380,
  },

  features: {
    gap: 10,
    marginBottom: 30,
  },

  featureCard: {
    backgroundColor: "#121212",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 16,
  },

  featureIcon: {
    color: "#ff8a00",
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 8,
  },

  featureTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 5,
  },

  featureText: {
    color: "#858585",
    fontSize: 13,
    lineHeight: 19,
  },

  primaryButton: {
    height: 57,
    borderRadius: 13,
    backgroundColor: "#ff8a00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  primaryText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  arrow: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 12,
  },

  loginButton: {
    height: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#383838",
    alignItems: "center",
    justifyContent: "center",
  },

  loginText: {
    color: "#bbbbbb",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  footer: {
    color: "#555555",
    fontSize: 10,
    textAlign: "center",
    marginTop: 30,
    letterSpacing: 0.8,
  },
});
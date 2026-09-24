import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useLanguage } from "../i18n/LanguageContext";

export type NavTab = "home" | "training" | "assessment" | "certificate";

interface BottomNavBarProps {
  activeTab?: NavTab;
}

export default function BottomNavBar({ activeTab = "home" }: BottomNavBarProps) {
  const { t } = useLanguage();

  const handleNav = (tab: NavTab, route: string) => {
    if (activeTab !== tab) {
      router.push(route as any);
    }
  };

  return (
    <View style={styles.container}>
      {/* Floating Pill Dock */}
      <View style={styles.dock}>
        {/* Home */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleNav("home", "/home")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconWrapper,
              activeTab === "home" && styles.iconWrapperActive,
            ]}
          >
            <Text
              style={[
                styles.icon,
                activeTab === "home" && styles.iconActive,
              ]}
            >
              🏠
            </Text>
          </View>
          <Text
            style={[
              styles.label,
              activeTab === "home" && styles.labelActive,
            ]}
          >
            {t.home.navHome || "Home"}
          </Text>
        </TouchableOpacity>

        {/* Training / Learn */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleNav("training", "/module/fire")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconWrapper,
              activeTab === "training" && styles.iconWrapperActive,
            ]}
          >
            <Text
              style={[
                styles.icon,
                activeTab === "training" && styles.iconActive,
              ]}
            >
              🎓
            </Text>
          </View>
          <Text
            style={[
              styles.label,
              activeTab === "training" && styles.labelActive,
            ]}
          >
            {t.home.navTraining || "Training"}
          </Text>
        </TouchableOpacity>

        {/* Assessment */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleNav("assessment", "/assessment")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconWrapper,
              activeTab === "assessment" && styles.iconWrapperActive,
            ]}
          >
            <Text
              style={[
                styles.icon,
                activeTab === "assessment" && styles.iconActive,
              ]}
            >
              📝
            </Text>
          </View>
          <Text
            style={[
              styles.label,
              activeTab === "assessment" && styles.labelActive,
            ]}
          >
            {t.home.navAssessment || "Assessment"}
          </Text>
        </TouchableOpacity>

        {/* Certificate */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleNav("certificate", "/certificate")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconWrapper,
              activeTab === "certificate" && styles.iconWrapperActive,
            ]}
          >
            <Text
              style={[
                styles.icon,
                activeTab === "certificate" && styles.iconActive,
              ]}
            >
              🏆
            </Text>
          </View>
          <Text
            style={[
              styles.label,
              activeTab === "certificate" && styles.labelActive,
            ]}
          >
            {t.home.navCertificate || "Certificates"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Floating Circular Action Button (AR Simulator FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/ar/preparation")}
        activeOpacity={0.85}
      >
        <View style={styles.fabInner}>
          <Text style={styles.fabSpark}>✦</Text>
          <Text style={styles.fabText}>AR</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 22,
    left: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 999,
  },

  dock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(18, 20, 24, 0.96)",
    borderRadius: 38,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: "#292e35",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    minWidth: 56,
  },

  iconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapperActive: {
    backgroundColor: "rgba(255, 138, 0, 0.22)",
    borderWidth: 1,
    borderColor: "rgba(255, 138, 0, 0.5)",
  },

  icon: {
    fontSize: 18,
    opacity: 0.7,
  },

  iconActive: {
    opacity: 1,
    transform: [{ scale: 1.08 }],
  },

  label: {
    color: "#828790",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },

  labelActive: {
    color: "#ff8a00",
    fontWeight: "800",
  },

  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ff6a00",
    borderWidth: 2,
    borderColor: "#ff9933",
    shadowColor: "#ff6a00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  fabInner: {
    alignItems: "center",
    justifyContent: "center",
  },

  fabSpark: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 20,
  },

  fabText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
});

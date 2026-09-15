import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useLanguage } from "../../i18n/LanguageContext";
import { launchUnityAR } from "../../services/unityAR";

export default function ARPreparationScreen() {
    const { t, language } = useLanguage();
    const [isLaunchingUnity, setIsLaunchingUnity] = useState(false);

    const prep = t?.arPreparation || {};

    const handleLaunchUnity = async () => {
        setIsLaunchingUnity(true);
        const result = await launchUnityAR();
        setIsLaunchingUnity(false);

        if (!result.success) {
            Alert.alert(
                language === "HI" ? "Unity 3D AR" : "Unity 3D AR Status",
                language === "HI"
                    ? "Unity 3D मॉड्यूल इस डिवाइस पर लोड नहीं हो सका। क्या आप कैमरा AR सिमुलेशन से जारी रखना चाहते हैं?"
                    : `${result.error || "Unity 3D AR could not be started."} Would you like to proceed with the Camera AR training?`,
                [
                    {
                        text: language === "HI" ? "रद्द करें" : "Cancel",
                        style: "cancel"
                    },
                    {
                        text: language === "HI" ? "कैमरा AR शुरू करें" : "Start Camera AR",
                        onPress: () => router.push("/ar/fire")
                    }
                ]
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    accessibilityLabel="Back"
                >
                    <Text style={styles.back}>‹</Text>
                </TouchableOpacity>

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>JHARKHAND SAFETY AR</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.arIcon}>◉</Text>

                <Text style={styles.title}>
                    {prep.title || "Prepare for AR Training"}
                </Text>

                <Text style={styles.subtitle}>
                    {prep.subtitle || "Fire & Explosion Response - Jharkhand Industrial Sector"}
                </Text>

                <Text style={styles.description}>
                    {prep.instructions || "Find a safe and open area before starting the augmented reality training simulation."}
                </Text>

                {/* Training Competencies Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        {prep.domainTitle || "Domain 1: Fire & Explosion Response"}
                    </Text>
                    <Text style={styles.domainSummary}>
                        {prep.domainDesc || "Interactive training overlaid on physical surroundings via phone camera (Android 10+, no headset required)."}
                    </Text>

                    <View style={styles.stepRow}>
                        <View style={styles.stepBadge}><Text style={styles.stepNum}>1</Text></View>
                        <Text style={styles.stepText}>
                            {language === "HI" ? "P-A-S-S अग्निशामक उपयोग प्रोटोकॉल" : "Extinguisher Operation (PASS Protocol)"}
                        </Text>
                    </View>

                    <View style={styles.stepRow}>
                        <View style={styles.stepBadge}><Text style={styles.stepNum}>2</Text></View>
                        <Text style={styles.stepText}>
                            {language === "HI" ? "आपातकालीन निकास पहचान और नेविगेशन" : "Emergency Exit Identification & Wayfinding"}
                        </Text>
                    </View>

                    <View style={styles.stepRow}>
                        <View style={styles.stepBadge}><Text style={styles.stepNum}>3</Text></View>
                        <Text style={styles.stepText}>
                            {language === "HI" ? "धुआं परत बचाव और सुरक्षित निकासी अनुक्रमण" : "Smoke Hazard Avoidance & Safe Evacuation Sequencing"}
                        </Text>
                    </View>
                </View>

                {/* Pre-training Checklist */}
                <View style={[styles.card, { marginTop: 14 }]}>
                    <Text style={styles.cardTitle}>
                        {language === "HI" ? "शुरू करने से पहले जांच" : "Before You Begin"}
                    </Text>

                    <Text style={styles.item}>✓ {prep.lightingCheck || "Ensure good lighting on work floor"}</Text>
                    <Text style={styles.item}>✓ {prep.clearArea || "Clear physical training perimeter (2m x 2m)"}</Text>
                    <Text style={styles.item}>✓ {prep.steadyHold || "Hold your phone steadily at chest height"}</Text>
                    <Text style={styles.item}>✓ {prep.followSafety || "Follow PASS protocol and evacuation markers"}</Text>
                </View>

                {/* Primary Button: Camera AR */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push("/ar/fire")}
                    activeOpacity={0.85}
                >
                    <Text style={styles.buttonText}>
                        {prep.start ? prep.start.toUpperCase() : "START CAMERA AR TRAINING"}
                    </Text>
                </TouchableOpacity>

                {/* Secondary Option: Unity 3D AR */}
                <TouchableOpacity
                    style={[styles.button, styles.unityButton]}
                    onPress={handleLaunchUnity}
                    disabled={isLaunchingUnity}
                    activeOpacity={0.85}
                >
                    {isLaunchingUnity ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.unityButtonText}>
                            🎮 {prep.startUnity ? prep.startUnity.toUpperCase() : "LAUNCH UNITY 3D AR EXPERIENCE"}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Assessment Link */}
                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => router.push("/assessment")}
                    activeOpacity={0.85}
                >
                    <Text style={styles.secondaryButtonText}>
                        {language === "HI" ? "मूल्यांकन पर जाएँ →" : "PROCEED TO ASSESSMENT →"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E8EEFF",
        paddingHorizontal: 20,
    },

    headerRow: {
        marginTop: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    backButton: {
        padding: 5,
    },

    back: {
        fontSize: 34,
        color: "#111",
        fontWeight: "600",
    },

    badge: {
        backgroundColor: "#0F172A",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
    },

    badgeText: {
        color: "#10B981",
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.8,
    },

    scrollContent: {
        paddingBottom: 40,
    },

    arIcon: {
        fontSize: 48,
        textAlign: "center",
        color: "#FF5A00",
        marginTop: 10,
        marginBottom: 10,
    },

    title: {
        fontSize: 24,
        fontWeight: "800",
        textAlign: "center",
        color: "#0F172A",
    },

    subtitle: {
        fontSize: 13,
        fontWeight: "700",
        textAlign: "center",
        color: "#FF5A00",
        marginTop: 4,
        letterSpacing: 0.5,
    },

    description: {
        fontSize: 13,
        lineHeight: 19,
        color: "#475569",
        textAlign: "center",
        marginTop: 8,
        paddingHorizontal: 10,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 18,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },

    cardTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: "#0F172A",
        marginBottom: 8,
    },

    domainSummary: {
        fontSize: 12,
        color: "#64748B",
        lineHeight: 17,
        marginBottom: 14,
    },

    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },

    stepBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#EFF6FF",
        borderWidth: 1.5,
        borderColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    stepNum: {
        color: "#2563EB",
        fontSize: 11,
        fontWeight: "800",
    },

    stepText: {
        fontSize: 13,
        color: "#1E293B",
        fontWeight: "600",
        flex: 1,
    },

    item: {
        fontSize: 13,
        color: "#334155",
        marginBottom: 9,
        lineHeight: 18,
    },

    button: {
        height: 54,
        backgroundColor: "#FF5A00",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        shadowColor: "#FF5A00",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "800",
        letterSpacing: 0.8,
    },

    unityButton: {
        backgroundColor: "#0F172A",
        marginTop: 10,
        shadowColor: "#0F172A",
    },

    unityButtonText: {
        color: "#38BDF8",
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 0.6,
    },

    secondaryButton: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: "#94A3B8",
        marginTop: 10,
        shadowOpacity: 0,
        elevation: 0,
    },

    secondaryButtonText: {
        color: "#475569",
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 0.6,
    },
});
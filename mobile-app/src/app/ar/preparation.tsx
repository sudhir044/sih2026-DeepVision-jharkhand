import React, { useState, useEffect, useRef } from "react";
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
import { launchUnityAR, addUnityEventListener } from "../../services/unityAR";

export default function ARPreparationScreen() {
    const { t, language } = useLanguage();
    const [isLaunchingUnity, setIsLaunchingUnity] = useState(false);
    const isNavigatingRef = useRef(false);

    const prep = t?.arPreparation || {};

    const navigateToAssessment = () => {
        if (!isNavigatingRef.current) {
            isNavigatingRef.current = true;
            console.log("[ARPreparationScreen] Navigating to /assessment");
            router.push("/assessment");
            setTimeout(() => {
                isNavigatingRef.current = false;
            }, 1500);
        }
    };

    useEffect(() => {
        const subCompleted = addUnityEventListener("UnityARCompleted", () => {
            console.log("[ARPreparationScreen] Received UnityARCompleted event -> auto navigating to assessment");
            navigateToAssessment();
        });

        const subClosed = addUnityEventListener("UnityARClosed", () => {
            console.log("[ARPreparationScreen] Received UnityARClosed event (user pressed Back)");
        });

        return () => {
            subCompleted.remove();
            subClosed.remove();
        };
    }, []);

    const handleLaunchUnity = async () => {
        setIsLaunchingUnity(true);
        const result = await launchUnityAR();
        setIsLaunchingUnity(false);

        if (result.success) {
            if (result.completed) {
                navigateToAssessment();
            }
        } else {
            Alert.alert(
                language === "HI" ? "AR सिमुलेशन स्थिति" : "AR Simulation Status",
                language === "HI"
                    ? (result.error || "AR सिमुलेशन शुरू नहीं हो सका। कृपया पुनः प्रयास करें।")
                    : `${result.error || "AR simulation could not be started. Please try again."}`,
                [
                    {
                        text: language === "HI" ? "ठीक है" : "OK",
                        style: "default",
                    },
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
                <Text style={styles.arIcon}>🎯</Text>

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
                        {prep.domainDesc || "Interactive 3D AR simulation for fire hazard response, extinguisher operation, and emergency exit routing."}
                    </Text>

                    <View style={styles.stepRow}>
                        <View style={styles.stepBadge}><Text style={styles.stepNum}>1</Text></View>
                        <Text style={styles.stepText}>
                            {language === "HI" ? "P-A-S-S अग्निशामक संचालन प्रोटोकॉल" : "Extinguisher Operation (PASS Protocol)"}
                        </Text>
                    </View>

                    <View style={styles.stepRow}>
                        <View style={styles.stepBadge}><Text style={styles.stepNum}>2</Text></View>
                        <Text style={styles.stepText}>
                            {language === "HI" ? "आपातकालीन निकास पहचान एवं मार्ग दर्शन" : "Emergency Exit Identification & Wayfinding"}
                        </Text>
                    </View>

                    <View style={styles.stepRow}>
                        <View style={styles.stepBadge}><Text style={styles.stepNum}>3</Text></View>
                        <Text style={styles.stepText}>
                            {language === "HI" ? "धुआं संकट परिहार एवं सुरक्षित निकासी" : "Smoke Hazard Avoidance & Safe Evacuation Sequencing"}
                        </Text>
                    </View>
                </View>

                {/* Pre-training Checklist */}
                <View style={[styles.card, { marginTop: 14 }]}>
                    <Text style={styles.cardTitle}>
                        {language === "HI" ? "प्रारंभ करने से पूर्व" : "Before You Begin"}
                    </Text>

                    <Text style={styles.item}>✓ {prep.lightingCheck || "Ensure good lighting on work floor"}</Text>
                    <Text style={styles.item}>✓ {prep.clearArea || "Clear physical training perimeter (2m x 2m)"}</Text>
                    <Text style={styles.item}>✓ {prep.steadyHold || "Hold your phone steadily at chest height"}</Text>
                    <Text style={styles.item}>✓ {prep.followSafety || "Follow PASS protocol and evacuation markers"}</Text>
                </View>

                {/* Primary Action Button: START AR */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLaunchUnity}
                    disabled={isLaunchingUnity}
                    activeOpacity={0.85}
                >
                    {isLaunchingUnity ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {prep.start ? prep.start.toUpperCase() : "START AR"}
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
                        {language === "HI" ? "मूल्यांकन पर जाएं →" : "PROCEED TO ASSESSMENT →"}
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

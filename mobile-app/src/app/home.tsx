import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../services/auth";
import { useLanguage } from "../i18n/LanguageContext";
import BottomNavBar from "../components/BottomNavBar";

export default function HomeScreen() {
    const [user, setUser] = useState<{ id?: number; name?: string; email?: string } | null>(null);
    const { t, language, setLanguage } = useLanguage();

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res?.user) {
                    setUser(res.user);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{t?.home?.greeting || "Welcome"},</Text>
                        <Text style={styles.name}>{user?.name || "Employee"}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.profile}
                        onPress={async () => {
                            await logout();
                            router.replace("/");
                        }}
                    >
                        <Text style={styles.profileText}>
                            {(user?.name || "E").charAt(0).toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Language Selector */}
                <View style={styles.languageRow}>
                    <Text style={styles.languageLabel}>
                        {t?.home?.language || "LANGUAGE"}
                    </Text>

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
                                    language === "EN" &&
                                        styles.languageActiveText,
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
                                    language === "HI" &&
                                        styles.languageActiveText,
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
                                    language === "SAT" &&
                                        styles.languageActiveText,
                                ]}
                            >
                                संताली
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Progress */}
                <View style={styles.progressCard}>
                    <Text style={styles.progressTitle}>{t?.home?.trainingProgress || "Training Progress"}</Text>

                    <View style={styles.progressRow}>
                        <Text style={styles.progressNumber}>0%</Text>
                        <Text style={styles.progressText}>0 of 2 modules completed</Text>
                    </View>

                    <View style={styles.progressBackground}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                {/* Available Modules */}
                <Text style={styles.sectionTitle}>{t?.home?.modules || "Available Modules"}</Text>

                {/* Fire Module */}
                <TouchableOpacity
                    style={styles.moduleCard}
                    onPress={() => router.push("/module/fire")}
                >
                    <View style={styles.iconBox}>
                        <Text style={styles.icon}>🔥</Text>
                    </View>

                    <View style={styles.moduleInfo}>
                        <Text style={styles.moduleTitle}>
                            {t?.home?.fireTitle || "Fire & Explosion Response"}
                        </Text>

                        <Text style={styles.moduleDescription}>
                            {t?.home?.fireDescription || "Learn fire hazard detection, extinguisher selection and emergency evacuation."}
                        </Text>

                        <View style={styles.moduleMeta}>
                            <Text style={styles.meta}>10 min</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.meta}>Beginner</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Gas Module */}
                <TouchableOpacity
                    style={styles.moduleCard}
                    onPress={() => router.push("/module/gas")}
                >
                    <View style={styles.iconBox}>
                        <Text style={styles.icon}>☣</Text>
                    </View>

                    <View style={styles.moduleInfo}>
                        <Text style={styles.moduleTitle}>
                            {t?.home?.gasTitle || "Gas Leak & Confined Space Safety"}
                        </Text>

                        <Text style={styles.moduleDescription}>
                            {t?.home?.gasDescription || "Learn gas detection, PPE, buddy-system and emergency extraction."}
                        </Text>

                        <View style={styles.moduleMeta}>
                            <Text style={styles.meta}>10 min</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.meta}>Intermediate</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Certificates */}
                <Text style={styles.sectionTitle}>{t?.home?.certificates || "Certificates"}</Text>

                <View style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>🏆</Text>
                    <Text style={styles.emptyTitle}>{t?.home?.noCertificates || "No Certificates Yet"}</Text>
                    <Text style={styles.emptyText}>
                        Complete a training module to earn your certificate.
                    </Text>
                </View>

                {/* Training Hub Quick Access Section */}
                <Text style={styles.sectionTitle}>{t?.home?.quickActions || "Quick Actions"}</Text>

                <View style={styles.quickGrid}>
                    {/* Learn Training Button */}
                    <TouchableOpacity
                        style={styles.quickCard}
                        onPress={() => router.push("/module/fire")}
                    >
                        <View style={[styles.quickIconBox, { backgroundColor: "#2A1805" }]}>
                            <Text style={styles.quickIcon}>🎓</Text>
                        </View>
                        <View style={styles.quickTextContainer}>
                            <Text style={styles.quickCardTitle}>{t?.home?.learnTrainingBtn || "Start AR Training"}</Text>
                            <Text style={styles.quickCardDesc}>{t?.home?.learnTrainingDesc || "Experience 3D hazard simulations"}</Text>
                        </View>
                        <Text style={styles.quickArrow}>→</Text>
                    </TouchableOpacity>

                    {/* Assessment Button */}
                    <TouchableOpacity
                        style={styles.quickCard}
                        onPress={() => router.push("/assessment")}
                    >
                        <View style={[styles.quickIconBox, { backgroundColor: "#0D2218" }]}>
                            <Text style={styles.quickIcon}>📝</Text>
                        </View>
                        <View style={styles.quickTextContainer}>
                            <Text style={styles.quickCardTitle}>{t?.home?.assessmentBtn || "Take Assessment"}</Text>
                            <Text style={styles.quickCardDesc}>{t?.home?.assessmentDesc || "Test your mine safety knowledge"}</Text>
                        </View>
                        <Text style={styles.quickArrow}>→</Text>
                    </TouchableOpacity>

                    {/* Certificate Button */}
                    <TouchableOpacity
                        style={styles.quickCard}
                        onPress={() => router.push("/certificate")}
                    >
                        <View style={[styles.quickIconBox, { backgroundColor: "#221A05" }]}>
                            <Text style={styles.quickIcon}>🏆</Text>
                        </View>
                        <View style={styles.quickTextContainer}>
                            <Text style={styles.quickCardTitle}>{t?.home?.certificateBtn || "My Certificates"}</Text>
                            <Text style={styles.quickCardDesc}>{t?.home?.certificateDesc || "View and download earned badges"}</Text>
                        </View>
                        <Text style={styles.quickArrow}>→</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Floating Navigation Dock with AR Action Button */}
            <BottomNavBar activeTab="home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050606",
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 110,
    },
    languageRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    languageLabel: {
        color: "#777777",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1,
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
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 7,
    },

    languageActive: {
        backgroundColor: "#ff8a00",
    },

    languageText: {
        color: "#999999",
        fontSize: 12,
        fontWeight: "700",
    },

    languageActiveText: {
        color: "#000000",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 60,
        marginBottom: 25,
    },

    greeting: {
        color: "#888",
        fontSize: 14,
    },

    name: {
        color: "#fff",
        fontSize: 25,
        fontWeight: "700",
        marginTop: 3,
    },

    profile: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: "#FF6600",
        alignItems: "center",
        justifyContent: "center",
    },

    profileText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },

    progressCard: {
        backgroundColor: "#101212",
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: "#252525",
        marginBottom: 30,
    },

    progressTitle: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 15,
    },

    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    progressNumber: {
        color: "#FF6600",
        fontSize: 30,
        fontWeight: "800",
    },

    progressText: {
        color: "#888",
        fontSize: 13,
    },

    progressBackground: {
        height: 7,
        backgroundColor: "#252525",
        borderRadius: 5,
        marginTop: 15,
    },

    progressFill: {
        width: "0%",
        height: "100%",
        backgroundColor: "#FF6600",
        borderRadius: 5,
    },

    sectionTitle: {
        color: "#fff",
        fontSize: 19,
        fontWeight: "700",
        marginBottom: 15,
    },

    moduleCard: {
        backgroundColor: "#101212",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#252525",
        padding: 16,
        flexDirection: "row",
        marginBottom: 14,
    },

    iconBox: {
        width: 55,
        height: 55,
        borderRadius: 10,
        backgroundColor: "#1B1510",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    icon: {
        fontSize: 25,
    },

    moduleInfo: {
        flex: 1,
    },

    moduleTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    moduleDescription: {
        color: "#888",
        fontSize: 12,
        lineHeight: 18,
        marginTop: 5,
    },

    moduleMeta: {
        flexDirection: "row",
        marginTop: 8,
        gap: 7,
    },

    meta: {
        color: "#FF6600",
        fontSize: 11,
    },

    dot: {
        color: "#555",
    },

    emptyCard: {
        backgroundColor: "#101212",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#252525",
        padding: 25,
        alignItems: "center",
        marginBottom: 30,
    },

    emptyIcon: {
        fontSize: 30,
        marginBottom: 10,
    },

    emptyTitle: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },

    emptyText: {
        color: "#777",
        fontSize: 12,
        textAlign: "center",
        marginTop: 5,
    },

    quickGrid: {
        gap: 12,
        marginBottom: 35,
    },

    quickCard: {
        backgroundColor: "#101212",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#252525",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
    },

    quickIconBox: {
        width: 48,
        height: 48,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    quickIcon: {
        fontSize: 22,
    },

    quickTextContainer: {
        flex: 1,
    },

    quickCardTitle: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 3,
    },

    quickCardDesc: {
        color: "#888888",
        fontSize: 12,
    },

    quickArrow: {
        color: "#ff8a00",
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 8,
    },
});
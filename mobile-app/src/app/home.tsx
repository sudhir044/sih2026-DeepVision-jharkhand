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

export default function HomeScreen() {
    const [user, setUser] = useState<{ id?: number; name?: string; email?: string } | null>(null);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res?.user) {
                    setUser(res.user);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome back,</Text>
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

                {/* Progress */}
                <View style={styles.progressCard}>
                    <Text style={styles.progressTitle}>Training Progress</Text>

                    <View style={styles.progressRow}>
                        <Text style={styles.progressNumber}>0%</Text>
                        <Text style={styles.progressText}>0 of 2 modules completed</Text>
                    </View>

                    <View style={styles.progressBackground}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                {/* Available Modules */}
                <Text style={styles.sectionTitle}>Available Training Modules</Text>

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
                            Fire & Explosion Response
                        </Text>

                        <Text style={styles.moduleDescription}>
                            Learn emergency response procedures for industrial fires.
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
                            Gas Leak & Confined Space
                        </Text>

                        <Text style={styles.moduleDescription}>
                            Learn gas leak detection and confined space safety protocols.
                        </Text>

                        <View style={styles.moduleMeta}>
                            <Text style={styles.meta}>10 min</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.meta}>Intermediate</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Certificates */}
                <Text style={styles.sectionTitle}>Your Certificates</Text>

                <View style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>🏆</Text>
                    <Text style={styles.emptyTitle}>No certificates yet</Text>
                    <Text style={styles.emptyText}>
                        Complete a training module to earn your certificate.
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050606",
        paddingHorizontal: 20,
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
});
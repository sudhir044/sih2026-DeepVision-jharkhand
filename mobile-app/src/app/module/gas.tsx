import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function GasModuleScreen() {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.back}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.step}>2 / 2</Text>
                </View>

                {/* Module Icon */}
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>☣</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>
                    Gas Leak & Confined Space
                </Text>

                <Text style={styles.description}>
                    Learn toxic gas detection, atmospheric monitoring, and confined space safety protocols for industrial mines.
                </Text>

                {/* Module Information */}
                <View style={styles.infoCard}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoValue}>10</Text>
                        <Text style={styles.infoLabel}>MINUTES</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoValue}>Intermediate</Text>
                        <Text style={styles.infoLabel}>LEVEL</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoValue}>AR</Text>
                        <Text style={styles.infoLabel}>MODE</Text>
                    </View>
                </View>

                {/* What you'll practice */}
                <Text style={styles.sectionTitle}>What you'll practice</Text>
                <View style={styles.practiceCard}>
                    <PracticeItem text="Detect harmful gases (Methane, CO, H2S)" />
                    <PracticeItem text="Select and wear multi-gas detectors" />
                    <PracticeItem text="Execute buddy-system entry protocol" />
                    <PracticeItem text="Initiate emergency evacuation alarm" />
                </View>

                {/* Start Button */}
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => router.push("/ar/preparation")}
                >
                    <Text style={styles.startText}>START TRAINING</Text>
                    <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

function PracticeItem({ text }: { text: string }) {
    return (
        <View style={styles.practiceItem}>
            <View style={styles.check}>
                <Text style={styles.checkText}>✓</Text>
            </View>
            <Text style={styles.practiceText}>{text}</Text>
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
        marginTop: 55,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    back: {
        color: "#FFFFFF",
        fontSize: 38,
        fontWeight: "300",
    },
    step: {
        color: "#888",
        fontSize: 13,
    },
    iconContainer: {
        width: 75,
        height: 75,
        borderRadius: 18,
        backgroundColor: "#1B1510",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        marginBottom: 20,
    },
    icon: {
        fontSize: 38,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "800",
        lineHeight: 34,
    },
    description: {
        color: "#999",
        fontSize: 14,
        lineHeight: 22,
        marginTop: 12,
    },
    infoCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#101212",
        borderWidth: 1,
        borderColor: "#252525",
        borderRadius: 12,
        paddingVertical: 18,
        marginTop: 25,
    },
    infoItem: {
        alignItems: "center",
        flex: 1,
    },
    infoValue: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    infoLabel: {
        color: "#777",
        fontSize: 9,
        marginTop: 5,
        letterSpacing: 1,
    },
    divider: {
        width: 1,
        height: 35,
        backgroundColor: "#252525",
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 19,
        fontWeight: "700",
        marginTop: 30,
        marginBottom: 15,
    },
    practiceCard: {
        backgroundColor: "#101212",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#252525",
        padding: 16,
    },
    practiceItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    check: {
        width: 25,
        height: 25,
        borderRadius: 13,
        backgroundColor: "#1B1510",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    checkText: {
        color: "#FF6600",
        fontSize: 14,
        fontWeight: "700",
    },
    practiceText: {
        color: "#CCC",
        fontSize: 13,
        flex: 1,
        lineHeight: 19,
    },
    startButton: {
        height: 56,
        backgroundColor: "#FF6600",
        borderRadius: 9,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        marginBottom: 35,
    },
    startText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 1,
    },
    arrow: {
        color: "#FFFFFF",
        fontSize: 22,
        marginLeft: 12,
    },
});

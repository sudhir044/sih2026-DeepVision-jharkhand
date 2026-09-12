import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { router } from "expo-router";

export default function AssessmentScreen() {
    const score = 85;

    return (
        <View style={styles.container}>

            <Text style={styles.label}>TRAINING COMPLETE</Text>

            <Text style={styles.title}>
                Assessment Result
            </Text>

            <View style={styles.scoreCircle}>
                <Text style={styles.score}>{score}%</Text>
                <Text style={styles.scoreLabel}>SCORE</Text>
            </View>

            <View style={styles.resultCard}>

                <ResultRow
                    label="Correct Actions"
                    value="5"
                />

                <ResultRow
                    label="Wrong Actions"
                    value="1"
                />

                <ResultRow
                    label="Safety Violations"
                    value="0"
                />

                <ResultRow
                    label="Time Taken"
                    value="02:34"
                />

            </View>

            <View style={styles.passBox}>
                <Text style={styles.passIcon}>✓</Text>

                <View>
                    <Text style={styles.passTitle}>
                        Training Passed
                    </Text>

                    <Text style={styles.passText}>
                        Required passing score: 70%
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.certificateButton}
                onPress={() => router.push("/certificate")}
            >
                <Text style={styles.buttonText}>
                    VIEW CERTIFICATE
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.homeButton}
                onPress={() => router.replace("/home")}
            >
                <Text style={styles.homeText}>
                    BACK TO HOME
                </Text>
            </TouchableOpacity>

        </View>
    );
}

function ResultRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050606",
        paddingHorizontal: 25,
        justifyContent: "center",
    },

    label: {
        color: "#FF6600",
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.5,
        textAlign: "center",
    },

    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 8,
    },

    scoreCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 7,
        borderColor: "#FF6600",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 28,
    },

    score: {
        color: "#FFFFFF",
        fontSize: 36,
        fontWeight: "800",
    },

    scoreLabel: {
        color: "#777",
        fontSize: 10,
        letterSpacing: 1,
    },

    resultCard: {
        backgroundColor: "#101212",
        borderWidth: 1,
        borderColor: "#252525",
        borderRadius: 12,
        padding: 16,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
    },

    rowLabel: {
        color: "#999",
        fontSize: 13,
    },

    rowValue: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
    },

    passBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0E1A13",
        borderWidth: 1,
        borderColor: "#1D4D2E",
        borderRadius: 10,
        padding: 15,
        marginTop: 15,
    },

    passIcon: {
        color: "#22C55E",
        fontSize: 25,
        marginRight: 12,
    },

    passTitle: {
        color: "#22C55E",
        fontSize: 15,
        fontWeight: "700",
    },

    passText: {
        color: "#888",
        fontSize: 11,
        marginTop: 3,
    },

    certificateButton: {
        height: 54,
        backgroundColor: "#FF6600",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 22,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "800",
        letterSpacing: 1,
    },

    homeButton: {
        alignItems: "center",
        padding: 15,
    },

    homeText: {
        color: "#999",
        fontSize: 12,
        fontWeight: "600",
    },
});
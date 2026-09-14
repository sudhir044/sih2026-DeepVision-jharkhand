import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { router } from "expo-router";

export default function ARPreparationScreen() {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.back}>‹</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.arIcon}>◉</Text>

                <Text style={styles.title}>
                    Prepare for AR Training
                </Text>

                <Text style={styles.description}>
                    Find a safe and open area before starting the
                    augmented reality training simulation.
                </Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Before you begin
                    </Text>

                    <Text style={styles.item}>✓ Ensure good lighting</Text>
                    <Text style={styles.item}>✓ Clear the training area</Text>
                    <Text style={styles.item}>✓ Hold your phone steadily</Text>
                    <Text style={styles.item}>✓ Follow all safety instructions</Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push("/ar/fire")}
                >
                    <Text style={styles.buttonText}>
                        START DEMO AR
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => router.push("/assessment")}
                >
                    <Text style={styles.secondaryButtonText}>
                        PROCEED TO ASSESSMENT →
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E8EEFF",
        paddingHorizontal: 22,
    },

    backButton: {
        marginTop: 55,
    },

    back: {
        fontSize: 38,
        color: "#111",
    },

    content: {
        flex: 1,
        justifyContent: "center",
        marginBottom: 50,
    },

    arIcon: {
        fontSize: 55,
        textAlign: "center",
        color: "#FF6600",
        marginBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        color: "#111",
    },

    description: {
        fontSize: 14,
        lineHeight: 21,
        color: "#666",
        textAlign: "center",
        marginTop: 12,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 20,
        marginTop: 30,
    },

    cardTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111",
        marginBottom: 15,
    },

    item: {
        fontSize: 14,
        color: "#555",
        marginBottom: 12,
    },

    button: {
        height: 56,
        backgroundColor: "#FF6600",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 1,
    },

    secondaryButton: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#FF6600",
        marginTop: 12,
    },

    secondaryButtonText: {
        color: "#FF6600",
        fontSize: 14,
        fontWeight: "800",
        letterSpacing: 0.8,
    },
});
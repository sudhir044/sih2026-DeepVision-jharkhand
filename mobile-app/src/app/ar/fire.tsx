import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { router } from "expo-router";

export default function FireARScreen() {
    return (
        <View style={styles.container}>

            {/* AR View */}
            <View style={styles.arView}>
                <View style={styles.topBar}>
                    <Text style={styles.arLabel}>AR TRAINING</Text>
                    <Text style={styles.timer}>02:34</Text>
                </View>

                {/* Simulated fire */}
                <View style={styles.fireArea}>
                    <Text style={styles.fire}>🔥</Text>
                    <Text style={styles.fireText}>FIRE DETECTED</Text>
                </View>

                {/* Detection message */}
                <View style={styles.detection}>
                    <View style={styles.statusDot} />
                    <Text style={styles.detectionText}>
                        Industrial fire detected
                    </Text>
                </View>

                {/* Instruction */}
                <View style={styles.instruction}>
                    <Text style={styles.instructionTitle}>
                        Select the correct extinguisher
                    </Text>

                    <Text style={styles.instructionText}>
                        Choose the appropriate extinguisher before
                        approaching the fire.
                    </Text>
                </View>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomPanel}>

                <Text style={styles.question}>
                    Which extinguisher should you use?
                </Text>

                <View style={styles.options}>

                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionIcon}>🧯</Text>
                        <Text style={styles.optionText}>
                            CO₂
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionIcon}>🧯</Text>
                        <Text style={styles.optionText}>
                            Water
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionIcon}>🧯</Text>
                        <Text style={styles.optionText}>
                            Foam
                        </Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.warning}>
                    <Text style={styles.warningText}>
                        ⚠ Maintain a safe distance
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => router.push("/assessment")}
                >
                    <Text style={styles.completeText}>
                        COMPLETE SIMULATION
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },

    arView: {
        flex: 1,
        backgroundColor: "#30343B",
        position: "relative",
    },

    topBar: {
        position: "absolute",
        top: 55,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 2,
    },

    arLabel: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 1,
    },

    timer: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },

    fireArea: {
        position: "absolute",
        top: "35%",
        left: 0,
        right: 0,
        alignItems: "center",
    },

    fire: {
        fontSize: 100,
    },

    fireText: {
        color: "#FF6600",
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 1,
        marginTop: 10,
    },

    detection: {
        position: "absolute",
        top: 115,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.65)",
        borderRadius: 10,
        padding: 13,
        flexDirection: "row",
        alignItems: "center",
    },

    statusDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: "#EF4444",
        marginRight: 9,
    },

    detectionText: {
        color: "#FFFFFF",
        fontSize: 12,
    },

    instruction: {
        position: "absolute",
        bottom: 25,
        left: 20,
        right: 20,
    },

    instructionTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },

    instructionText: {
        color: "#CCCCCC",
        fontSize: 12,
        lineHeight: 18,
        marginTop: 5,
    },

    bottomPanel: {
        backgroundColor: "#0B0C0C",
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 25,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },

    question: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 14,
    },

    options: {
        flexDirection: "row",
        gap: 10,
    },

    option: {
        flex: 1,
        height: 75,
        backgroundColor: "#151717",
        borderWidth: 1,
        borderColor: "#303333",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    optionIcon: {
        fontSize: 25,
    },

    optionText: {
        color: "#FFFFFF",
        fontSize: 11,
        marginTop: 5,
        fontWeight: "600",
    },

    warning: {
        backgroundColor: "#1A160F",
        borderRadius: 8,
        padding: 10,
        marginTop: 12,
    },

    warningText: {
        color: "#F59E0B",
        fontSize: 11,
        textAlign: "center",
    },

    completeButton: {
        height: 52,
        backgroundColor: "#FF6600",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
    },

    completeText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 0.8,
    },
});
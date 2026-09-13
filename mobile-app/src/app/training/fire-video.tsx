import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { VideoView, useVideoPlayer } from "expo-video";

const FIRE_VIDEO = require("../../../assets/videos/fire-safety.mp4");

export default function FireSafetyVideoScreen() {
    const [videoCompleted, setVideoCompleted] = useState(false);

    const player = useVideoPlayer(FIRE_VIDEO, (player) => {
        player.loop = false;
    });

    const handleContinue = () => {
        if (!videoCompleted) {
            return;
        }

        router.push("/ar/preparation");
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.back}>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.step}>TRAINING • 1 / 3</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>
                    Fire Safety Briefing
                </Text>

                <Text style={styles.description}>
                    Watch this safety briefing before entering the
                    AR practical simulation.
                </Text>

                {/* Video */}
                <View style={styles.videoContainer}>
                    <VideoView
                        player={player}
                        style={styles.video}
                        contentFit="contain"
                        nativeControls
                    />
                </View>

                {/* Training information */}
                <View style={styles.infoCard}>
                    <View>
                        <Text style={styles.infoTitle}>
                            Before you begin
                        </Text>

                        <Text style={styles.infoText}>
                            Learn how to identify industrial fire hazards,
                            select the correct extinguisher and maintain
                            a safe distance.
                        </Text>
                    </View>
                </View>

                {/* Key points */}
                <Text style={styles.sectionTitle}>
                    Key safety points
                </Text>

                <View style={styles.pointsCard}>
                    <SafetyPoint text="Identify the type of fire before responding" />
                    <SafetyPoint text="Select the correct fire extinguisher" />
                    <SafetyPoint text="Maintain a safe distance from the hazard" />
                    <SafetyPoint text="Follow the emergency response procedure" />
                </View>

                {/* Completion */}
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        !videoCompleted && styles.disabledButton,
                    ]}
                    disabled={!videoCompleted}
                    onPress={handleContinue}
                >
                    <Text style={styles.completeText}>
                        {videoCompleted
                            ? "CONTINUE TO AR TRAINING  →"
                            : "WATCH VIDEO TO CONTINUE"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footer}>
                    Complete the briefing before starting the practical simulation.
                </Text>
            </ScrollView>
        </View>
    );
}

function SafetyPoint({ text }: { text: string }) {
    return (
        <View style={styles.point}>
            <View style={styles.check}>
                <Text style={styles.checkText}>✓</Text>
            </View>

            <Text style={styles.pointText}>
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050606",
        paddingHorizontal: 20,
    },

    content: {
        paddingBottom: 40,
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
        fontSize: 11,
        letterSpacing: 0.8,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "800",
        marginTop: 30,
    },

    description: {
        color: "#999",
        fontSize: 14,
        lineHeight: 21,
        marginTop: 10,
    },

    videoContainer: {
        width: "100%",
        height: 210,
        backgroundColor: "#101212",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#252525",
        overflow: "hidden",
        marginTop: 25,
    },

    video: {
        width: "100%",
        height: "100%",
    },

    infoCard: {
        backgroundColor: "#101212",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#252525",
        padding: 16,
        marginTop: 20,
    },

    infoTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 7,
    },

    infoText: {
        color: "#999",
        fontSize: 12,
        lineHeight: 19,
    },

    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 19,
        fontWeight: "700",
        marginTop: 28,
        marginBottom: 14,
    },

    pointsCard: {
        backgroundColor: "#101212",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#252525",
        padding: 16,
    },

    point: {
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

    pointText: {
        color: "#CCC",
        fontSize: 13,
        lineHeight: 19,
        flex: 1,
    },

    completeButton: {
        height: 56,
        backgroundColor: "#FF6600",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
    },

    disabledButton: {
        backgroundColor: "#3A3A3A",
    },

    completeText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 0.6,
    },

    footer: {
        color: "#666",
        fontSize: 11,
        textAlign: "center",
        marginTop: 15,
    },
});
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { VideoView, useVideoPlayer } from "expo-video";

const FIRE_VIDEO = require("../../../assets/videos/fire-safety.mp4");

export default function FireSafetyVideoScreen() {
    const [videoCompleted, setVideoCompleted] = useState(false);

    const player = useVideoPlayer(FIRE_VIDEO, (player) => {
        player.loop = false;
    });

    useEffect(() => {
        const subscription = player.addListener(
            "playToEnd",
            () => {
                setVideoCompleted(true);
            }
        );

        return () => subscription.remove();
    }, [player]);

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

                    <Text style={styles.headerTitle}>
                        Fire Safety Training
                    </Text>

                    <View style={{ width: 30 }} />
                </View>

                {/* Progress */}
                <Text style={styles.step}>STEP 1 OF 4</Text>

                <Text style={styles.title}>
                    Safety Briefing
                </Text>

                <Text style={styles.subtitle}>
                    Watch the complete safety briefing before starting
                    the AR practical training.
                </Text>

                {/* Video */}
                <View style={styles.videoContainer}>
                    <VideoView
                        style={styles.video}
                        player={player}
                        nativeControls
                        contentFit="contain"
                    />
                </View>

                {/* Status */}
                <View style={styles.statusCard}>
                    <View
                        style={[
                            styles.statusDot,
                            videoCompleted && styles.statusCompleted,
                        ]}
                    />

                    <Text style={styles.statusText}>
                        {videoCompleted
                            ? "Video completed"
                            : "Watch the complete video"}
                    </Text>
                </View>

                {/* Learning Points */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        You will learn
                    </Text>

                    <Text style={styles.item}>
                        ✓ Identifying fire hazards
                    </Text>

                    <Text style={styles.item}>
                        ✓ Raising the emergency alarm
                    </Text>

                    <Text style={styles.item}>
                        ✓ Selecting the correct extinguisher
                    </Text>

                    <Text style={styles.item}>
                        ✓ Safe evacuation procedure
                    </Text>
                </View>

                {/* Continue */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        !videoCompleted && styles.buttonDisabled,
                    ]}
                    disabled={!videoCompleted}
                    onPress={() => router.push("/ar/preparation")}
                >
                    <Text style={styles.buttonText}>
                        {videoCompleted
                            ? "CONTINUE TO AR TRAINING"
                            : "WATCH VIDEO TO CONTINUE"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#080808",
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 25,
    },

    back: {
        color: "#ffffff",
        fontSize: 38,
        fontWeight: "300",
    },

    headerTitle: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "700",
    },

    step: {
        color: "#ff8a00",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: 8,
    },

    title: {
        color: "#ffffff",
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 8,
    },

    subtitle: {
        color: "#9b9b9b",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
    },

    videoContainer: {
        width: "100%",
        height: 215,
        backgroundColor: "#151515",
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#333333",
        marginBottom: 15,
    },

    video: {
        width: "100%",
        height: "100%",
    },

    statusCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#121212",
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#292929",
    },

    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#777777",
        marginRight: 10,
    },

    statusCompleted: {
        backgroundColor: "#4CAF50",
    },

    statusText: {
        color: "#cccccc",
        fontSize: 14,
        fontWeight: "600",
    },

    card: {
        backgroundColor: "#121212",
        borderRadius: 16,
        padding: 18,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: "#292929",
    },

    cardTitle: {
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 15,
    },

    item: {
        color: "#cccccc",
        fontSize: 14,
        marginBottom: 11,
        lineHeight: 20,
    },

    button: {
        backgroundColor: "#ff8a00",
        paddingVertical: 17,
        borderRadius: 12,
        alignItems: "center",
    },

    buttonDisabled: {
        backgroundColor: "#3a3a3a",
    },

    buttonText: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
});
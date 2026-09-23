import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import { useLanguage } from "../../i18n/LanguageContext";

const FIRE_VIDEO = require("../../../assets/videos/fire-safety.mp4");

export default function FireSafetyVideoScreen() {
    const { t, language } = useLanguage();
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const player = useVideoPlayer(FIRE_VIDEO, (p) => {
        p.loop = false;
        try {
            p.play();
        } catch (e) {
            console.warn("Autoplay setup error:", e);
        }
    });

    const { isPlaying } = useEvent(player, "playingChange", {
        isPlaying: player.playing,
    });

    const { status } = useEvent(player, "statusChange", {
        status: player.status,
    });

    useEffect(() => {
        // Try playing on component mount
        const timer = setTimeout(() => {
            try {
                if (!player.playing) {
                    player.play();
                }
                setHasStarted(true);
            } catch (e) {
                console.warn("Mount play error:", e);
            }
        }, 300);

        const subscription = player.addListener("playToEnd", () => {
            setVideoCompleted(true);
        });

        return () => {
            clearTimeout(timer);
            subscription.remove();
        };
    }, [player]);

    const handleTogglePlay = () => {
        setHasStarted(true);
        try {
            if (player.playing) {
                player.pause();
            } else {
                player.play();
            }
        } catch (e) {
            console.warn("Toggle play error:", e);
        }
    };

    const handleReplay = () => {
        try {
            player.replay();
        } catch (e) {
            console.warn("Replay error:", e);
        }
    };

    const handleSkip = () => {
        setVideoCompleted(true);
    };

    const isHi = language === "HI";

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backBtn}
                        accessibilityLabel="Go back"
                    >
                        <Text style={styles.back}>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        {isHi ? "अग्नि सुरक्षा प्रशिक्षण" : "Fire Safety Training"}
                    </Text>

                    <View style={{ width: 34 }} />
                </View>

                {/* Progress */}
                <Text style={styles.step}>
                    {t?.video?.step || (isHi ? "चरण 1 / 4" : "STEP 1 OF 4")}
                </Text>

                <Text style={styles.title}>
                    {t?.video?.title || (isHi ? "सुरक्षा ब्रीफिंग" : "Safety Briefing")}
                </Text>

                <Text style={styles.subtitle}>
                    {isHi
                        ? "एआर प्रैक्टिकल प्रशिक्षण शुरू करने से पहले पूरा सुरक्षा वीडियो देखें।"
                        : "Watch the complete safety briefing before starting the AR practical training."}
                </Text>

                {/* Video Player Box */}
                <View style={styles.videoContainer}>
                    <VideoView
                        style={styles.video}
                        player={player}
                        nativeControls
                        contentFit="contain"
                    />

                    {/* Overlay Play button if paused and user hasn't interacted or paused */}
                    {!isPlaying && (
                        <TouchableOpacity
                            style={styles.playOverlay}
                            onPress={handleTogglePlay}
                            activeOpacity={0.7}
                        >
                            <View style={styles.playOverlayCircle}>
                                <Text style={styles.playOverlayIcon}>▶</Text>
                            </View>
                            <Text style={styles.playOverlayText}>
                                {isHi ? "वीडियो चलाएं" : "TAP TO PLAY"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {status === "loading" && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#FF5A00" />
                        </View>
                    )}
                </View>

                {/* Quick Player Controls Bar */}
                <View style={styles.controlsRow}>
                    <TouchableOpacity
                        style={[styles.controlBtn, isPlaying && styles.controlBtnActive]}
                        onPress={handleTogglePlay}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.controlBtnText}>
                            {isPlaying ? (isHi ? "⏸ रोकें" : "⏸ Pause") : (isHi ? "▶ चलाएं" : "▶ Play")}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.controlBtn}
                        onPress={handleReplay}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.controlBtnText}>
                            {isHi ? "↺ पुनः चलाएं" : "↺ Replay"}
                        </Text>
                    </TouchableOpacity>

                    {!videoCompleted && (
                        <TouchableOpacity
                            style={[styles.controlBtn, styles.skipBtn]}
                            onPress={handleSkip}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.skipBtnText}>
                                {isHi ? "छोड़ें ⏩" : "Skip ⏩"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Status Card */}
                <View style={styles.statusCard}>
                    <View
                        style={[
                            styles.statusDot,
                            videoCompleted
                                ? styles.statusCompleted
                                : isPlaying
                                ? styles.statusPlaying
                                : styles.statusPaused,
                        ]}
                    />

                    <Text style={styles.statusText}>
                        {videoCompleted
                            ? isHi
                                ? "वीडियो पूर्ण हुआ ✓"
                                : "Video Completed ✓"
                            : isPlaying
                            ? isHi
                                ? "वीडियो चल रहा है..."
                                : "Playing briefing video..."
                            : isHi
                            ? "वीडियो रुका हुआ है (शुरू करने के लिए टैप करें)"
                            : "Paused (Tap Play to watch)"}
                    </Text>
                </View>

                {/* Learning Points */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        {t?.video?.learningPoints || (isHi ? "आप क्या सीखेंगे" : "You will learn")}
                    </Text>

                    <Text style={styles.item}>
                        ✓ {isHi ? "आग के खतरों और प्रकारों की पहचान" : "Identifying fire hazards & classes"}
                    </Text>

                    <Text style={styles.item}>
                        ✓ {isHi ? "आपातकालीन अलार्म बजाना और घोषणा" : "Raising the emergency alarm"}
                    </Text>

                    <Text style={styles.item}>
                        ✓ {isHi ? "P-A-S-S अग्निशामक संचालन तकनीक" : "PASS extinguisher operation technique"}
                    </Text>

                    <Text style={styles.item}>
                        ✓ {isHi ? "धुआं परत से सुरक्षित निकासी मार्ग" : "Safe evacuation routing & smoke layer crawl"}
                    </Text>
                </View>

                {/* Continue to AR Training Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        !videoCompleted && styles.buttonDisabled,
                    ]}
                    disabled={!videoCompleted}
                    onPress={() => router.push("/ar/preparation")}
                    activeOpacity={0.85}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            !videoCompleted && styles.buttonTextDisabled,
                        ]}
                    >
                        {videoCompleted
                            ? isHi
                                ? "एआर प्रशिक्षण पर आगे बढ़ें →"
                                : "CONTINUE TO AR TRAINING →"
                            : isHi
                            ? "जारी रखने के लिए वीडियो देखें"
                            : "WATCH VIDEO TO CONTINUE"}
                    </Text>
                </TouchableOpacity>

                {/* Direct quick jump for testing/dev */}
                {!videoCompleted && (
                    <TouchableOpacity
                        style={styles.devBypass}
                        onPress={() => {
                            setVideoCompleted(true);
                            router.push("/ar/preparation");
                        }}
                    >
                        <Text style={styles.devBypassText}>
                            {isHi ? "सीधे AR तैयारी स्क्रीन पर जाएं →" : "Jump directly to AR Preparation →"}
                        </Text>
                    </TouchableOpacity>
                )}
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
        marginTop: 35,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    backBtn: {
        padding: 4,
    },

    back: {
        color: "#ffffff",
        fontSize: 34,
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
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 8,
    },

    subtitle: {
        color: "#9b9b9b",
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 18,
    },

    videoContainer: {
        width: "100%",
        height: 220,
        backgroundColor: "#000000",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1.5,
        borderColor: "#2a2a2a",
        position: "relative",
    },

    video: {
        width: "100%",
        height: "100%",
    },

    playOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        alignItems: "center",
        justifyContent: "center",
    },

    playOverlayCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255, 90, 0, 0.9)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF5A00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 6,
    },

    playOverlayIcon: {
        color: "#ffffff",
        fontSize: 24,
        marginLeft: 4,
    },

    playOverlayText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "700",
        marginTop: 8,
        letterSpacing: 0.8,
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.6)",
        alignItems: "center",
        justifyContent: "center",
    },

    controlsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        marginTop: 12,
        marginBottom: 16,
    },

    controlBtn: {
        flex: 1,
        backgroundColor: "#1F2430",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#334155",
    },

    controlBtnActive: {
        backgroundColor: "#1e3a5f",
        borderColor: "#38bdf8",
    },

    controlBtnText: {
        color: "#f1f5f9",
        fontSize: 13,
        fontWeight: "700",
    },

    skipBtn: {
        backgroundColor: "#291818",
        borderColor: "#7f1d1d",
    },

    skipBtnText: {
        color: "#f87171",
        fontSize: 13,
        fontWeight: "700",
    },

    statusCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#121212",
        borderRadius: 12,
        padding: 14,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#292929",
    },

    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },

    statusPlaying: {
        backgroundColor: "#06B6D4",
    },

    statusPaused: {
        backgroundColor: "#F59E0B",
    },

    statusCompleted: {
        backgroundColor: "#10B981",
    },

    statusText: {
        color: "#e2e8f0",
        fontSize: 13,
        fontWeight: "600",
        flex: 1,
    },

    card: {
        backgroundColor: "#121212",
        borderRadius: 16,
        padding: 18,
        marginBottom: 22,
        borderWidth: 1,
        borderColor: "#292929",
    },

    cardTitle: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 14,
    },

    item: {
        color: "#cbd5e1",
        fontSize: 13,
        marginBottom: 10,
        lineHeight: 19,
    },

    button: {
        backgroundColor: "#FF5A00",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#FF5A00",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },

    buttonDisabled: {
        backgroundColor: "#222226",
        shadowOpacity: 0,
        elevation: 0,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "800",
        letterSpacing: 0.6,
    },

    buttonTextDisabled: {
        color: "#64748B",
    },

    devBypass: {
        marginTop: 16,
        alignItems: "center",
        padding: 10,
    },

    devBypassText: {
        color: "#94A3B8",
        fontSize: 12,
        textDecorationLine: "underline",
    },
});
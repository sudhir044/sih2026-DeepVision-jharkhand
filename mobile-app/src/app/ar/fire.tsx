import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    Animated,
    Easing
} from "react-native";
import { router } from "expo-router";
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function FireARScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [fireDetected, setFireDetected] = useState(false);
    const [fireExtinguished, setFireExtinguished] = useState(false);

    // Animation values
    const fireScale = useRef(new Animated.Value(1)).current;
    const foamOpacity = useRef(new Animated.Value(0)).current;

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const animateExtinguish = () => {
        // Show foam spraying
        Animated.sequence([
            Animated.timing(foamOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            // Shrink the fire and hide foam
            Animated.parallel([
                Animated.timing(fireScale, {
                    toValue: 0.1,
                    duration: 1500,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: true,
                }),
                Animated.timing(foamOpacity, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ]).start(() => {
            // Once animation completes, set state
            setFireExtinguished(true);
        });
    };

    return (
        <View style={styles.container}>

            {/* AR View */}
            <CameraView style={styles.arView} facing="back">
                <View style={styles.topBar}>
                    <Text style={styles.arLabel}>AR TRAINING</Text>
                    <Text style={styles.timer}>02:34</Text>
                </View>

                {/* Simulated fire */}
                {fireDetected && !fireExtinguished && (
                    <View style={styles.fireArea}>
                        <Animated.View style={{ transform: [{ scale: fireScale }] }}>
                            <Text style={styles.fire}>🔥</Text>
                        </Animated.View>

                        <Animated.View style={[styles.foamParticles, { opacity: foamOpacity }]}>
                            <Text style={styles.foamText}>❄️❄️❄️</Text>
                            <Text style={styles.foamText}>💨💨💨</Text>
                        </Animated.View>

                        <Text style={styles.fireText}>FIRE DETECTED</Text>
                    </View>
                )}

                {fireExtinguished && (
                    <View style={styles.fireArea}>
                        <Text style={styles.fire}>✅</Text>
                        <Text style={[styles.fireText, {color: '#22c55e'}]}>FIRE EXTINGUISHED</Text>
                    </View>
                )}

                {/* Detection message */}
                {fireDetected && !fireExtinguished && (
                    <View style={styles.detection}>
                        <View style={styles.statusDot} />
                        <Text style={styles.detectionText}>
                            Industrial fire detected
                        </Text>
                    </View>
                )}

                {/* Spawn Fire Button */}
                {!fireDetected && (
                    <View style={styles.scanArea}>
                        <TouchableOpacity 
                            style={styles.scanButton} 
                            onPress={() => setFireDetected(true)}
                        >
                            <Text style={styles.scanButtonText}>Scan Plane & Spawn Fire</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Instruction */}
                <View style={styles.instruction}>
                    <Text style={styles.instructionTitle}>
                        {fireExtinguished ? "Area Secured" : "Select the correct extinguisher"}
                    </Text>

                    <Text style={styles.instructionText}>
                        {fireExtinguished 
                            ? "Great job using the correct extinguisher to put out the fire." 
                            : "Choose the appropriate extinguisher before approaching the fire."}
                    </Text>
                </View>
            </CameraView>

            {/* Bottom Controls */}
            <View style={styles.bottomPanel}>

                <Text style={styles.question}>
                    Which extinguisher should you use?
                </Text>

                <View style={styles.options}>

                    <TouchableOpacity 
                        style={styles.option} 
                        onPress={() => {
                            if (!fireDetected) alert("Scan the plane to spawn the fire first!");
                            else animateExtinguish();
                        }}
                    >
                        <Text style={styles.optionIcon}>🧯</Text>
                        <Text style={styles.optionText}>
                            CO₂
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.option}
                        onPress={() => {
                            if (!fireDetected) alert("Scan the plane to spawn the fire first!");
                            else alert("Water is dangerous for electrical/chemical industrial fires! Use CO2 or Foam.");
                        }}
                    >
                        <Text style={styles.optionIcon}>🧯</Text>
                        <Text style={styles.optionText}>
                            Water
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.option}
                        onPress={() => {
                            if (!fireDetected) alert("Scan the plane to spawn the fire first!");
                            else animateExtinguish();
                        }}
                    >
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

    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },

    permissionText: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
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

    foamParticles: {
        position: 'absolute',
        top: 20,
        zIndex: 10,
        alignItems: 'center',
    },

    foamText: {
        fontSize: 40,
        marginVertical: -5,
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

    scanArea: {
        position: 'absolute',
        top: '40%',
        left: 0,
        right: 0,
        alignItems: 'center',
    },

    scanButton: {
        backgroundColor: '#FF6600',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },

    scanButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
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
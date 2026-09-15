import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    Animated,
    Easing,
    ScrollView,
    Alert,
    Dimensions
} from "react-native";
import { router } from "expo-router";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLanguage } from "../../i18n/LanguageContext";
import { launchUnityAR } from "../../services/unityAR";

const { width } = Dimensions.get('window');

type TrainingPhase = 'extinguisher' | 'exit_id' | 'evacuation';

export default function FireARScreen() {
    const { t, language } = useLanguage();
    const [permission, requestPermission] = useCameraPermissions();

    // Active phase in Domain 1
    const [activePhase, setActivePhase] = useState<TrainingPhase>('extinguisher');

    // Phase 1: Fire & Extinguisher State
    const [fireDetected, setFireDetected] = useState(false);
    const [selectedExtinguisher, setSelectedExtinguisher] = useState<'CO2' | 'Water' | 'Foam' | null>(null);
    const [passStep, setPassStep] = useState<number>(1); // 1: Pull, 2: Aim, 3: Squeeze, 4: Sweep
    const [fireExtinguished, setFireExtinguished] = useState(false);
    const [suppressionProgress, setSuppressionProgress] = useState(0);

    // Phase 2: Exit Identification State
    const [selectedExit, setSelectedExit] = useState<string | null>(null);
    const [exitIdentified, setExitIdentified] = useState(false);

    // Phase 3: Evacuation Sequencing State
    const [evacStep, setEvacStep] = useState(1);
    const [alarmRaised, setAlarmRaised] = useState(false);
    const [stayLowConfirmed, setStayLowConfirmed] = useState(false);
    const [assemblyReached, setAssemblyReached] = useState(false);

    // Timer state
    const [secondsElapsed, setSecondsElapsed] = useState(0);

    // Animations
    const fireScale = useRef(new Animated.Value(1)).current;
    const foamOpacity = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const sirenAnim = useRef(new Animated.Value(0)).current;
    const reticleSweepAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Pulse animation for AR beacons and siren
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim]);

    // Reticle sweep animation during PASS Sweep step
    useEffect(() => {
        if (passStep === 4 && !fireExtinguished) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(reticleSweepAnim, {
                        toValue: 30,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(reticleSweepAnim, {
                        toValue: -30,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [passStep, fireExtinguished]);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    {language === "HI"
                        ? "कैमरा AR प्रशिक्षण के लिए अनुमति आवश्यक है"
                        : "We need your camera permission for AR training overlay"}
                </Text>
                <Button onPress={requestPermission} title={language === "HI" ? "अनुमति दें" : "Grant Permission"} color="#FF5A00" />
            </View>
        );
    }

    const formatTimer = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // Phase 1: Extinguisher Animation and Logic
    const handleExtinguisherSelect = (type: 'CO2' | 'Water' | 'Foam') => {
        if (!fireDetected) {
            Alert.alert(
                language === "HI" ? "स्कैन करें" : "Scan First",
                language === "HI"
                    ? "कृपया पहले अग्नि स्थान को स्कैन करें।"
                    : "Please scan the industrial work area to locate the fire first."
            );
            return;
        }

        setSelectedExtinguisher(type);
        if (type === 'Water') {
            Alert.alert(
                language === "HI" ? "चेतावनी: खतरनाक चयन!" : "HAZARD ALERT: Dangerous Extinguisher!",
                language === "HI"
                    ? "पानी का उपयोग बिजली और तेल की आग पर जानलेवा हो सकता है! कृपया CO2 या Foam अग्निशामक चुनें।"
                    : "Water must NOT be used on industrial electrical or chemical fires. Select CO2 or Foam instead."
            );
            return;
        }

        // Advance PASS step
        if (passStep === 1) {
            setPassStep(2);
        }
    };

    const handlePassAction = () => {
        if (!selectedExtinguisher) {
            Alert.alert(
                language === "HI" ? "अग्निशामक चुनें" : "Select Extinguisher",
                language === "HI" ? "कृपया पहले उपयुक्त अग्निशामक चुनें।" : "Please select an appropriate extinguisher first."
            );
            return;
        }

        if (passStep === 1) {
            setPassStep(2);
        } else if (passStep === 2) {
            setPassStep(3);
        } else if (passStep === 3) {
            // Squeeze handle
            Animated.timing(foamOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
            setSuppressionProgress(50);
            setPassStep(4);
        } else if (passStep === 4) {
            // Sweep side-to-side
            setSuppressionProgress(100);
            Animated.parallel([
                Animated.timing(fireScale, {
                    toValue: 0.05,
                    duration: 1200,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: true,
                }),
                Animated.timing(foamOpacity, {
                    toValue: 0,
                    duration: 1400,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setFireExtinguished(true);
            });
        }
    };

    const handleUnityShortcut = async () => {
        const res = await launchUnityAR();
        if (!res.success) {
            Alert.alert(
                "Unity 3D AR",
                language === "HI"
                    ? "Unity 3D AR मॉड्यूल लोड नहीं हुआ। कैमरा AR प्रशिक्षण जारी है।"
                    : "Unity 3D AR is not accessible on this device. Continuing in Camera AR mode."
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Live Camera AR View */}
            <CameraView style={styles.arView} facing="back">
                {/* Top Status Bar */}
                <View style={styles.topBar}>
                    <View style={styles.domainPill}>
                        <View style={styles.liveDot} />
                        <Text style={styles.arLabel}>
                            {language === "HI" ? "डोमेन 1 • आग एवं विस्फोट" : "DOMAIN 1 • FIRE & EXPLOSION"}
                        </Text>
                    </View>

                    <View style={styles.topRightControls}>
                        <TouchableOpacity style={styles.unityBadge} onPress={handleUnityShortcut}>
                            <Text style={styles.unityBadgeText}>🎮 3D UNITY</Text>
                        </TouchableOpacity>
                        <Text style={styles.timer}>{formatTimer(secondsElapsed)}</Text>
                    </View>
                </View>

                {/* Phase Selection Tabs */}
                <View style={styles.phaseTabs}>
                    <TouchableOpacity
                        style={[styles.phaseTab, activePhase === 'extinguisher' && styles.phaseTabActive]}
                        onPress={() => setActivePhase('extinguisher')}
                    >
                        <Text style={[styles.phaseTabText, activePhase === 'extinguisher' && styles.phaseTabTextActive]}>
                            {language === "HI" ? "1. अग्निशामक (PASS)" : "1. PASS Protocol"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.phaseTab, activePhase === 'exit_id' && styles.phaseTabActive]}
                        onPress={() => setActivePhase('exit_id')}
                    >
                        <Text style={[styles.phaseTabText, activePhase === 'exit_id' && styles.phaseTabTextActive]}>
                            {language === "HI" ? "2. निकास पहचान" : "2. Exit ID"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.phaseTab, activePhase === 'evacuation' && styles.phaseTabActive]}
                        onPress={() => setActivePhase('evacuation')}
                    >
                        <Text style={[styles.phaseTabText, activePhase === 'evacuation' && styles.phaseTabTextActive]}>
                            {language === "HI" ? "3. निकासी अनुक्रम" : "3. Evacuation"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ----------------- PHASE 1: FIRE & PASS PROTOCOL ----------------- */}
                {activePhase === 'extinguisher' && (
                    <>
                        {/* Simulated Fire AR Target */}
                        {fireDetected && !fireExtinguished && (
                            <View style={styles.fireArea}>
                                <Animated.View style={{ transform: [{ scale: fireScale }] }}>
                                    <Text style={styles.fire}>🔥</Text>
                                </Animated.View>

                                {/* Reticle Target Indicator */}
                                {passStep >= 2 && (
                                    <Animated.View style={[
                                        styles.aimReticle,
                                        { transform: [{ translateX: reticleSweepAnim }] }
                                    ]}>
                                        <View style={styles.reticleCrosshair} />
                                        <Text style={styles.reticleText}>
                                            {passStep === 2 ? "🎯 AIM AT BASE" : "↔️ SWEEP SIDE-TO-SIDE"}
                                        </Text>
                                    </Animated.View>
                                )}

                                <Animated.View style={[styles.foamParticles, { opacity: foamOpacity }]}>
                                    <Text style={styles.foamText}>❄️❄️❄️</Text>
                                    <Text style={styles.foamText}>💨💨💨</Text>
                                </Animated.View>

                                <Text style={styles.fireText}>
                                    {language === "HI" ? "औद्योगिक आग चिन्हित (कक्षा C/E)" : "INDUSTRIAL HAZARD DETECTED"}
                                </Text>
                            </View>
                        )}

                        {/* Extinguished State */}
                        {fireExtinguished && (
                            <View style={styles.fireArea}>
                                <Text style={styles.fire}>✅</Text>
                                <Text style={[styles.fireText, { color: '#22C55E' }]}>
                                    {language === "HI" ? "आग पूरी तरह बुझाई गई" : "FIRE EXTINGUISHED (AREA SECURED)"}
                                </Text>
                            </View>
                        )}

                        {/* Initial Scan Button */}
                        {!fireDetected && (
                            <View style={styles.scanArea}>
                                <TouchableOpacity
                                    style={styles.scanButton}
                                    onPress={() => setFireDetected(true)}
                                    activeOpacity={0.85}
                                >
                                    <Text style={styles.scanButtonText}>
                                        {language === "HI" ? "🔍 सतह स्कैन करें और आग चिन्हित करें" : "🔍 Scan Industrial Plane & Detect Fire"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* PASS Progress Bar HUD */}
                        {fireDetected && (
                            <View style={styles.passHud}>
                                <View style={styles.passHeaderRow}>
                                    <Text style={styles.passTitle}>
                                        {language === "HI" ? "P-A-S-S सुरक्षा नियम:" : "PASS Protocol Status:"}
                                    </Text>
                                    <Text style={styles.passPercent}>{suppressionProgress}%</Text>
                                </View>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${suppressionProgress}%` }]} />
                                </View>
                                <View style={styles.passStepsRow}>
                                    <Text style={[styles.passStepBadge, passStep >= 1 && styles.passStepDone]}>P (Pull)</Text>
                                    <Text style={[styles.passStepBadge, passStep >= 2 && styles.passStepDone]}>A (Aim)</Text>
                                    <Text style={[styles.passStepBadge, passStep >= 3 && styles.passStepDone]}>S (Squeeze)</Text>
                                    <Text style={[styles.passStepBadge, passStep >= 4 && styles.passStepDone]}>S (Sweep)</Text>
                                </View>
                            </View>
                        )}
                    </>
                )}

                {/* ----------------- PHASE 2: EXIT IDENTIFICATION ----------------- */}
                {activePhase === 'exit_id' && (
                    <View style={styles.exitOverlayContainer}>
                        {/* Exit Beacon 1 (Primary - North Corridor) */}
                        <Animated.View style={[styles.exitBeacon, { top: '30%', left: '15%', transform: [{ scale: pulseAnim }] }]}>
                            <TouchableOpacity
                                style={[styles.exitCard, selectedExit === 'primary' && styles.exitCardSelected]}
                                onPress={() => {
                                    setSelectedExit('primary');
                                    setExitIdentified(true);
                                }}
                            >
                                <Text style={styles.exitIcon}>🚪</Text>
                                <View>
                                    <Text style={styles.exitTitle}>PRIMARY EMERGENCY EXIT</Text>
                                    <Text style={styles.exitDistance}>Distance: 12 Meters • Clear Route</Text>
                                    <Text style={styles.exitSub}>Photoluminescent Waypoint #1</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Exit Beacon 2 (Secondary - Shaft Stairwell) */}
                        <View style={[styles.exitBeacon, { top: '48%', right: '10%' }]}>
                            <TouchableOpacity
                                style={[styles.exitCard, styles.exitCardSecondary, selectedExit === 'shaft' && styles.exitCardSelected]}
                                onPress={() => {
                                    setSelectedExit('shaft');
                                    setExitIdentified(true);
                                }}
                            >
                                <Text style={styles.exitIcon}>🛗</Text>
                                <View>
                                    <Text style={styles.exitTitle}>MINE SHAFT STAIRWELL 2</Text>
                                    <Text style={styles.exitDistance}>Distance: 28 Meters • Secondary</Text>
                                    <Text style={styles.exitSub}>Pressurized Shaft Passage</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Blocked Passage Hazard Marker */}
                        <View style={[styles.exitBeacon, { top: '65%', left: '20%' }]}>
                            <View style={[styles.exitCard, styles.exitCardBlocked]}>
                                <Text style={styles.exitIcon}>⛔</Text>
                                <View>
                                    <Text style={[styles.exitTitle, { color: '#EF4444' }]}>HAZARD: PASSAGEWAY BLOCKED</Text>
                                    <Text style={styles.exitDistance}>Heavy debris & electrical hazard</Text>
                                </View>
                            </View>
                        </View>

                        {/* Guided Prompt */}
                        <View style={styles.arPromptBox}>
                            <Text style={styles.arPromptTitle}>
                                {language === "HI" ? "🟢 आपातकालीन निकास चिन्हित करें" : "🟢 Identify Safe Emergency Exit"}
                            </Text>
                            <Text style={styles.arPromptDesc}>
                                {exitIdentified
                                    ? (language === "HI" ? "सत्यापित! प्राथमिक निकास द्वार साफ है।" : "Verified! Primary Exit Corridor is unobstructed.")
                                    : (language === "HI" ? "हरे निकास मार्कर पर टैप करके मार्ग की पुष्टि करें।" : "Tap the photoluminescent green exit beacon to confirm evacuation route.")}
                            </Text>
                        </View>
                    </View>
                )}

                {/* ----------------- PHASE 3: EVACUATION SEQUENCING ----------------- */}
                {activePhase === 'evacuation' && (
                    <View style={styles.evacOverlayContainer}>
                        {/* Smoke Hazard Layer */}
                        <View style={styles.smokeLayer}>
                            <Text style={styles.smokeWarning}>⚠️ TOXIC GAS & SMOKE CEILING LAYER</Text>
                            <Text style={styles.smokeDesc}>
                                {language === "HI" ? "धुएं की परत से नीचे झुककर चलें (< 1 मीटर)" : "Crouch Low Under Smoke Layer (< 1.0m from floor)"}
                            </Text>
                        </View>

                        {/* Evacuation Waypoint Indicator */}
                        <Animated.View style={[styles.evacWaypoint, { transform: [{ scale: pulseAnim }] }]}>
                            <Text style={styles.evacWaypointIcon}>🏃‍♂️</Text>
                            <Text style={styles.evacWaypointText}>
                                {evacStep === 1 && (language === "HI" ? "चरण 1: अलार्म बजाएं" : "Step 1: Sound Mine Siren")}
                                {evacStep === 2 && (language === "HI" ? "चरण 2: झुककर आगे बढ़ें" : "Step 2: Low-Crawl Under Smoke")}
                                {evacStep === 3 && (language === "HI" ? "चरण 3: सभा स्थल की ओर बढ़ें" : "Step 3: Proceed to Assembly Point")}
                                {evacStep === 4 && (language === "HI" ? "चरण 4: सुरक्षित सभा स्थल पहुँचे" : "Step 4: Arrived at Safe Assembly Point")}
                            </Text>
                        </Animated.View>

                        {/* Evacuation Checklist HUD */}
                        <View style={styles.evacChecklistCard}>
                            <TouchableOpacity
                                style={styles.evacCheckItem}
                                onPress={() => {
                                    setAlarmRaised(true);
                                    if (evacStep === 1) setEvacStep(2);
                                }}
                            >
                                <Text style={styles.evacCheckRadio}>{alarmRaised ? '✅' : '⚪'}</Text>
                                <Text style={[styles.evacCheckText, alarmRaised && styles.evacCheckDone]}>
                                    {language === "HI" ? "औद्योगिक सायरन / अलार्म सक्रिय करें" : "1. Sound Mine/Factory Siren"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.evacCheckItem}
                                onPress={() => {
                                    setStayLowConfirmed(true);
                                    if (evacStep === 2) setEvacStep(3);
                                }}
                            >
                                <Text style={styles.evacCheckRadio}>{stayLowConfirmed ? '✅' : '⚪'}</Text>
                                <Text style={[styles.evacCheckText, stayLowConfirmed && styles.evacCheckDone]}>
                                    {language === "HI" ? "धुएं की परत से नीचे झुकें (< 1 मीटर)" : "2. Maintain Low Crawl Below Smoke Layer"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.evacCheckItem}
                                onPress={() => {
                                    setAssemblyReached(true);
                                    setEvacStep(4);
                                }}
                            >
                                <Text style={styles.evacCheckRadio}>{assemblyReached ? '✅' : '⚪'}</Text>
                                <Text style={[styles.evacCheckText, assemblyReached && styles.evacCheckDone]}>
                                    {language === "HI" ? "सुरक्षित सभा स्थल पर उपस्थिति दर्ज करें" : "3. Reach Safe Assembly Point & Check-in"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </CameraView>

            {/* ----------------- BOTTOM CONTROL PANEL ----------------- */}
            <View style={styles.bottomPanel}>
                {/* Contextual Phase Controls */}
                {activePhase === 'extinguisher' && (
                    <>
                        <View style={styles.questionRow}>
                            <Text style={styles.question}>
                                {language === "HI" ? "कौन सा अग्निशामक चुनना चाहिए?" : "Which extinguisher should you use?"}
                            </Text>
                            {selectedExtinguisher && (
                                <Text style={styles.selectedPill}>Selected: {selectedExtinguisher}</Text>
                            )}
                        </View>

                        {/* Extinguisher Types: CO2, Water, Foam */}
                        <View style={styles.options}>
                            <TouchableOpacity
                                style={[styles.option, selectedExtinguisher === 'CO2' && styles.optionSelected]}
                                onPress={() => handleExtinguisherSelect('CO2')}
                            >
                                <Text style={styles.optionIcon}>🧯</Text>
                                <Text style={styles.optionText}>CO₂ (Gas)</Text>
                                <Text style={styles.optionSub}>Electrical & Fuel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.option, selectedExtinguisher === 'Water' && styles.optionWarning]}
                                onPress={() => handleExtinguisherSelect('Water')}
                            >
                                <Text style={styles.optionIcon}>🧯</Text>
                                <Text style={styles.optionText}>Water</Text>
                                <Text style={styles.optionSub}>Combustibles only</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.option, selectedExtinguisher === 'Foam' && styles.optionSelected]}
                                onPress={() => handleExtinguisherSelect('Foam')}
                            >
                                <Text style={styles.optionIcon}>🧯</Text>
                                <Text style={styles.optionText}>Foam</Text>
                                <Text style={styles.optionSub}>Industrial Oils</Text>
                            </TouchableOpacity>
                        </View>

                        {/* PASS Trigger Button */}
                        {fireDetected && !fireExtinguished && (
                            <TouchableOpacity
                                style={styles.passActionButton}
                                onPress={handlePassAction}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.passActionText}>
                                    {passStep === 1 && (language === "HI" ? "P - सेफ्टी पिन खींचें (PULL PIN)" : "P - PULL SAFETY PIN")}
                                    {passStep === 2 && (language === "HI" ? "A - आग की जड़ पर निशाना साधें (AIM)" : "A - AIM AT BASE OF FIRE")}
                                    {passStep === 3 && (language === "HI" ? "S - हैंडल दबाएँ (SQUEEZE)" : "S - SQUEEZE LEVER / TRIGGER")}
                                    {passStep === 4 && (language === "HI" ? "S - दाएँ-बाएँ घुमाएँ (SWEEP)" : "S - SWEEP NOZZLE SIDE-TO-SIDE")}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}

                {activePhase === 'exit_id' && (
                    <View style={styles.phaseControlRow}>
                        <Text style={styles.phaseGuideText}>
                            {language === "HI"
                                ? "आपातकालीन निकास की पहचान पूरी होने के बाद निकासी अनुक्रम पर जाएँ।"
                                : "Identify unobstructed exit route before starting facility evacuation."}
                        </Text>
                        <TouchableOpacity
                            style={styles.nextPhaseBtn}
                            onPress={() => setActivePhase('evacuation')}
                        >
                            <Text style={styles.nextPhaseBtnText}>
                                {language === "HI" ? "अगला: निकासी अनुक्रम →" : "Next: Evacuation Sequencing →"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {activePhase === 'evacuation' && (
                    <View style={styles.phaseControlRow}>
                        <Text style={styles.phaseGuideText}>
                            {assemblyReached
                                ? (language === "HI" ? "✅ तीनों सुरक्षा चरण पूरे हुए! अब प्रमाणन मूल्यांकन करें।" : "✅ All 3 AR safety phases completed! Proceed to certification.")
                                : (language === "HI" ? "सभी तीनों निकासी चरणों को पूरा करें।" : "Check off all evacuation steps to complete simulation.")}
                        </Text>
                    </View>
                )}

                {/* Safety Warning */}
                <View style={styles.warning}>
                    <Text style={styles.warningText}>
                        {language === "HI"
                            ? "⚠ औद्योगिक सुरक्षा: हमेशा हवा की दिशा में खड़े होकर बुझाएं और निकासी मार्ग कभी बाधित न करें"
                            : "⚠ Safety Rule: Always keep an unblocked exit at your back and stand 2-3m away."}
                    </Text>
                </View>

                {/* Complete Simulation & Assessment Navigation */}
                <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => router.push("/assessment")}
                    activeOpacity={0.85}
                >
                    <Text style={styles.completeText}>
                        {language === "HI" ? "प्रशिक्षण पूरा करें और मूल्यांकन दें →" : "COMPLETE SIMULATION & ASSESS →"}
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
        padding: 20,
    },

    permissionText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 20,
        lineHeight: 22,
    },

    arView: {
        flex: 1,
        backgroundColor: "#1E293B",
        position: "relative",
    },

    topBar: {
        position: "absolute",
        top: 50,
        left: 15,
        right: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 20,
    },

    domainPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
    },

    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#EF4444",
        marginRight: 7,
    },

    arLabel: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 0.8,
    },

    topRightControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    unityBadge: {
        backgroundColor: "rgba(37, 99, 235, 0.85)",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#60A5FA",
    },

    unityBadgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.5,
    },

    timer: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 12,
    },

    phaseTabs: {
        position: "absolute",
        top: 95,
        left: 15,
        right: 15,
        flexDirection: "row",
        gap: 6,
        zIndex: 20,
    },

    phaseTab: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },

    phaseTabActive: {
        backgroundColor: "#FF5A00",
        borderColor: "#FF8C42",
    },

    phaseTabText: {
        color: "#CBD5E1",
        fontSize: 10,
        fontWeight: "700",
    },

    phaseTabTextActive: {
        color: "#FFFFFF",
        fontWeight: "800",
    },

    fireArea: {
        position: "absolute",
        top: "32%",
        left: 0,
        right: 0,
        alignItems: "center",
    },

    fire: {
        fontSize: 90,
    },

    fireText: {
        color: "#FF5A00",
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: 1,
        marginTop: 6,
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },

    aimReticle: {
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    reticleCrosshair: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#22C55E',
        borderStyle: 'dashed',
    },

    reticleText: {
        color: '#22C55E',
        fontSize: 11,
        fontWeight: '800',
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },

    foamParticles: {
        position: 'absolute',
        top: 20,
        zIndex: 10,
        alignItems: 'center',
    },

    foamText: {
        fontSize: 36,
        marginVertical: -5,
    },

    scanArea: {
        position: 'absolute',
        top: '45%',
        left: 0,
        right: 0,
        alignItems: 'center',
    },

    scanButton: {
        backgroundColor: '#FF5A00',
        paddingHorizontal: 22,
        paddingVertical: 13,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },

    scanButtonText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 13,
        letterSpacing: 0.5,
    },

    passHud: {
        position: 'absolute',
        bottom: 12,
        left: 15,
        right: 15,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },

    passHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    passTitle: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },

    passPercent: {
        color: '#22C55E',
        fontSize: 12,
        fontWeight: '800',
    },

    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },

    progressBarFill: {
        height: '100%',
        backgroundColor: '#22C55E',
    },

    passStepsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    passStepBadge: {
        color: '#94A3B8',
        fontSize: 10,
        fontWeight: '700',
    },

    passStepDone: {
        color: '#22C55E',
        fontWeight: '800',
    },

    // Phase 2 Styles
    exitOverlayContainer: {
        flex: 1,
        position: 'relative',
    },

    exitBeacon: {
        position: 'absolute',
        zIndex: 10,
    },

    exitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(6, 78, 59, 0.9)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#10B981',
        gap: 8,
    },

    exitCardSelected: {
        borderColor: '#FACC15',
        backgroundColor: 'rgba(6, 78, 59, 1)',
    },

    exitCardSecondary: {
        backgroundColor: 'rgba(30, 58, 138, 0.9)',
        borderColor: '#3B82F6',
    },

    exitCardBlocked: {
        backgroundColor: 'rgba(127, 29, 29, 0.85)',
        borderColor: '#EF4444',
    },

    exitIcon: {
        fontSize: 22,
    },

    exitTitle: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },

    exitDistance: {
        color: '#A7F3D0',
        fontSize: 10,
        fontWeight: '600',
    },

    exitSub: {
        color: '#CBD5E1',
        fontSize: 9,
    },

    arPromptBox: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: '#10B981',
    },

    arPromptTitle: {
        color: '#10B981',
        fontSize: 13,
        fontWeight: '800',
        marginBottom: 3,
    },

    arPromptDesc: {
        color: '#E2E8F0',
        fontSize: 11,
        lineHeight: 16,
    },

    // Phase 3 Styles
    evacOverlayContainer: {
        flex: 1,
        position: 'relative',
    },

    smokeLayer: {
        position: 'absolute',
        top: 145,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(30, 41, 59, 0.85)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#F59E0B',
    },

    smokeWarning: {
        color: '#F59E0B',
        fontSize: 11,
        fontWeight: '800',
        textAlign: 'center',
    },

    smokeDesc: {
        color: '#FFFFFF',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 2,
    },

    evacWaypoint: {
        position: 'absolute',
        top: '42%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#22C55E',
    },

    evacWaypointIcon: {
        fontSize: 28,
    },

    evacWaypointText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
        marginTop: 4,
    },

    evacChecklistCard: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        gap: 8,
    },

    evacCheckItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    evacCheckRadio: {
        fontSize: 14,
    },

    evacCheckText: {
        color: '#CBD5E1',
        fontSize: 11,
        fontWeight: '600',
        flex: 1,
    },

    evacCheckDone: {
        color: '#22C55E',
        fontWeight: '700',
    },

    // Bottom Panel Styles
    bottomPanel: {
        backgroundColor: "#0F172A",
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 22,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },

    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    question: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
    },

    selectedPill: {
        color: '#38BDF8',
        fontSize: 11,
        fontWeight: '700',
    },

    options: {
        flexDirection: "row",
        gap: 8,
    },

    option: {
        flex: 1,
        height: 72,
        backgroundColor: "#1E293B",
        borderWidth: 1.5,
        borderColor: "#334155",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
    },

    optionSelected: {
        borderColor: "#FF5A00",
        backgroundColor: "rgba(255, 90, 0, 0.12)",
    },

    optionWarning: {
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
    },

    optionIcon: {
        fontSize: 20,
    },

    optionText: {
        color: "#FFFFFF",
        fontSize: 11,
        marginTop: 3,
        fontWeight: "700",
    },

    optionSub: {
        color: "#94A3B8",
        fontSize: 8,
        marginTop: 1,
        textAlign: 'center',
    },

    passActionButton: {
        backgroundColor: '#FF5A00',
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },

    passActionText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.6,
    },

    phaseControlRow: {
        paddingVertical: 6,
    },

    phaseGuideText: {
        color: '#E2E8F0',
        fontSize: 11,
        lineHeight: 16,
    },

    nextPhaseBtn: {
        backgroundColor: '#2563EB',
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },

    nextPhaseBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },

    warning: {
        backgroundColor: "rgba(245, 158, 11, 0.12)",
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "rgba(245, 158, 11, 0.3)",
    },

    warningText: {
        color: "#FBBF24",
        fontSize: 10,
        lineHeight: 14,
        textAlign: "center",
    },

    completeButton: {
        height: 48,
        backgroundColor: "#10B981",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },

    completeText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 0.8,
    },
});
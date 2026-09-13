import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import ARCanvas3DEngine from '../components/ARCanvas3DEngine';
import { colors } from '../theme/colors';
import { translations } from '../i18n/translations';
import { soundEngine } from '../services/sound';

export default function ARSimulationScreen({
  moduleType = 'fire',
  onFinishSimulation,
  onBack,
  lang = 'en',
  onToggleLang,
}) {
  const t = translations[lang] || translations.en;
  const isFire = moduleType === 'fire';

  // Step state: 1 to 7
  const [step, setStep] = useState(1);
  const [anchorLocked, setAnchorLocked] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [selectedExtinguisher, setSelectedExtinguisher] = useState(null);
  const [pinPulled, setPinPulled] = useState(false);
  const [fireHealth, setFireHealth] = useState(100);
  const [isSpraying, setIsSpraying] = useState(false);
  const [extinguisherGauge, setExtinguisherGauge] = useState(100);

  // Time & Wrong Action metrics
  const [seconds, setSeconds] = useState(0);
  const [wrongActions, setWrongActions] = useState(0);

  // Session Stopwatch
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fire extinguishing spray physics loop + Spray Sound
  useEffect(() => {
    let interval;
    if (isSpraying && fireHealth > 0) {
      interval = setInterval(() => {
        soundEngine.playSpraySound();
        setFireHealth((prevHealth) => {
          const newHealth = Math.max(0, prevHealth - 15);
          setExtinguisherGauge((prevGauge) => Math.max(0, prevGauge - 8));

          if (newHealth <= 0) {
            clearInterval(interval);
            setIsSpraying(false);
            soundEngine.playVictorySound();
            setTimeout(() => {
              setStep(6);
            }, 600);
          }
          return newHealth;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isSpraying, fireHealth]);

  const handleTriggerAlarm = () => {
    setAlarmTriggered(true);
    soundEngine.playAlarmSound();
    setTimeout(() => setStep(3), 400);
  };

  const handleNextStep = () => {
    if (step < 7) {
      setStep((prev) => prev + 1);
    } else {
      soundEngine.playVictorySound();
      const minutesStr = String(Math.floor(seconds / 60)).padStart(2, '0');
      const secsStr = String(seconds % 60).padStart(2, '0');
      const timeTakenStr = `${minutesStr}:${secsStr}`;
      const computedScore = Math.max(75, 100 - wrongActions * 5);

      onFinishSimulation({
        score: computedScore,
        correctActions: 7,
        wrongActions: wrongActions,
        safetyViolations: wrongActions > 0 ? 1 : 0,
        timeTaken: timeTakenStr,
        moduleTitle: isFire
          ? 'Fire & Explosion Response'
          : 'Gas Leak & Confined Space',
      });
    }
  };

  // 7 Steps Configuration
  const stepsConfig = [
    {
      stepNum: 1,
      title: lang === 'hi' ? 'चरण 1: खतरा पहचानें और सतह एंकर करें' : 'Step 1: Identify Hazard & Set Anchor',
      instruction: lang === 'hi' ? 'आग के स्थान पर एंकर लॉक करने के लिए AR लक्ष्य पर टैप करें' : 'Tap the glowing AR target on camera feed to lock spatial anchor',
      actionBtn: anchorLocked
        ? (lang === 'hi' ? '✓ एंकर लॉक हो गया (आगे बढ़ें)' : '✓ ANCHOR LOCKED (NEXT)')
        : (lang === 'hi' ? '🎯 एंकर स्थापित करें' : '🎯 LOCK SPATIAL ANCHOR'),
      onAction: () => {
        setAnchorLocked(true);
        setTimeout(() => setStep(2), 400);
      },
    },
    {
      stepNum: 2,
      title: lang === 'hi' ? 'चरण 2: आपातकालीन अलार्म बजाएं' : 'Step 2: Raise Emergency Fire Alarm',
      instruction: lang === 'hi' ? 'आपातकालीन सायरन बजाने के लिए अलार्म स्टेशन खींचें' : 'Pull the emergency fire alarm station to alert all plant workers',
      actionBtn: alarmTriggered
        ? (lang === 'hi' ? '🔔 अलार्म बज रहा है (आगे बढ़ें)' : '🔔 ALARM TRIGGERED (NEXT)')
        : (lang === 'hi' ? '🔔 अलार्म बजाएं' : '🔔 TRIGGER FIRE ALARM'),
      onAction: handleTriggerAlarm,
    },
    {
      stepNum: 3,
      title: lang === 'hi' ? 'चरण 3: सही अग्निशामक का चयन करें' : 'Step 3: Select Correct Extinguisher',
      instruction: lang === 'hi' ? 'ईंधन/गैस की आग के लिए उपयुक्त CO2 उपकरण चुनें' : 'Choose CO2 Extinguisher suitable for Class B/C industrial fires',
      actionBtn: null, // Render Extinguisher choices
    },
    {
      stepNum: 4,
      title: lang === 'hi' ? 'चरण 4: सुरक्षा पिन निकालें (PASS नियम)' : 'Step 4: Pull Safety Pin (P.A.S.S)',
      instruction: lang === 'hi' ? 'अग्निशामक हैंडल से सुरक्षा पिन निकालने के लिए दबाएं' : 'Pull tamper safety pin from extinguisher nozzle handle',
      actionBtn: pinPulled
        ? (lang === 'hi' ? '✓ सुरक्षा पिन निकाली गई (आगे बढ़ें)' : '✓ PIN PULLED (NEXT)')
        : (lang === 'hi' ? '🧯 सुरक्षा पिन निकालें' : '🧯 PULL SAFETY PIN'),
      onAction: () => {
        setPinPulled(true);
        setTimeout(() => setStep(5), 400);
      },
    },
    {
      stepNum: 5,
      title: lang === 'hi' ? 'चरण 5: आग के आधार पर निशाना साधें और छिड़काव करें' : 'Step 5: Aim at Base & Spray',
      instruction: lang === 'hi' ? 'आग बुझाने के लिए स्प्रे ट्रिगर को दबाए रखें' : 'Hold spray trigger to discharge CO2 foam at base of fire',
      actionBtn: null, // Render Spray trigger
    },
    {
      stepNum: 6,
      title: lang === 'hi' ? 'चरण 6: आपातकालीन निकास मार्ग खोजें' : 'Step 6: Identify Emergency Exit Route',
      instruction: lang === 'hi' ? 'AR फर्श तीरों का पालन करें और सुरक्षित द्वार की ओर बढ़ें' : 'Follow green AR floor guidance arrows toward nearest exit door',
      actionBtn: lang === 'hi' ? '🚪 निकास मार्ग का पालन करें' : '🚪 FOLLOW EXIT ROUTE',
      onAction: () => setStep(7),
    },
    {
      stepNum: 7,
      title: lang === 'hi' ? 'चरण 7: सुरक्षित निकासी पूर्ण करें' : 'Step 7: Complete Safe Evacuation',
      instruction: lang === 'hi' ? 'सुरक्षित असेंबली ज़ोन में पहुंचें और सत्र समाप्त करें' : 'Arrive at designated safe assembly area & complete certification',
      actionBtn: lang === 'hi' ? '✅ प्रशिक्षण पूर्ण करें' : '✅ FINISH SIMULATION',
      onAction: handleNextStep,
    },
  ];

  const currentStepData = stepsConfig[step - 1];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />

      {/* AR Canvas 3D Graphics & Video Engine */}
      <ARCanvas3DEngine
        fireHealth={fireHealth}
        isSpraying={isSpraying}
        stepNumber={step}
        totalSteps={7}
        onAnchorTap={() => {
          if (step === 1) {
            setAnchorLocked(true);
            setTimeout(() => setStep(2), 400);
          }
        }}
      >
        {/* Top Telemetry Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backText}>‹ {t.back}</Text>
          </TouchableOpacity>

          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>
              ⏱️ {String(Math.floor(seconds / 60)).padStart(2, '0')}:
              {String(seconds % 60).padStart(2, '0')}
            </Text>
          </View>

          {onToggleLang && (
            <TouchableOpacity style={styles.langBtn} onPress={onToggleLang}>
              <Text style={styles.langText}>
                {lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 EN'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Step Progress Bar */}
        <View style={styles.stepProgressContainer}>
          <Text style={styles.stepProgressText}>STEP {step} OF 7</Text>
          <View style={styles.stepTrack}>
            <View style={[styles.stepFill, { width: `${(step / 7) * 100}%` }]} />
          </View>
        </View>

        {/* Step HUD Card Instruction */}
        <View style={styles.hudInstructionCard}>
          <Text style={styles.hudTitle}>{currentStepData.title}</Text>
          <Text style={styles.hudInstruction}>
            {currentStepData.instruction}
          </Text>
        </View>

        {/* Bottom Interactive Controls */}
        <View style={styles.bottomControls}>
          {/* Step 3: Extinguisher Picker */}
          {step === 3 && (
            <View style={styles.extinguisherGrid}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.extCard,
                  selectedExtinguisher === 'co2' && styles.extCardActive,
                ]}
                onPress={() => {
                  setSelectedExtinguisher('co2');
                  setTimeout(() => setStep(4), 400);
                }}
              >
                <Text style={styles.extTitle}>CO2 Extinguisher</Text>
                <Text style={styles.extTag}>Class B/C (Recommended)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.extCard,
                  selectedExtinguisher === 'water' && styles.extCardActive,
                ]}
                onPress={() => {
                  setSelectedExtinguisher('water');
                  setWrongActions((p) => p + 1);
                  setTimeout(() => setStep(4), 400);
                }}
              >
                <Text style={styles.extTitle}>Water Extinguisher</Text>
                <Text style={styles.extTag}>Class A Only</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 5: Spray Trigger */}
          {step === 5 && (
            <View style={styles.sprayControlBox}>
              <View style={styles.gaugeBarRow}>
                <Text style={styles.gaugeLabel}>
                  EXTINGUISHER CO2 FILL: {extinguisherGauge}%
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.sprayTriggerBtn,
                  isSpraying && styles.sprayTriggerBtnActive,
                ]}
                onPress={() => setIsSpraying(!isSpraying)}
              >
                <Text style={styles.sprayTriggerText}>
                  {isSpraying
                    ? '💨 SPRAYING CO2 AT FLAMES...'
                    : 'PRESS TO SPRAY EXTINGUISHER'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Generic Action Buttons */}
          {currentStepData.actionBtn && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.primaryActionBtn}
              onPress={currentStepData.onAction}
            >
              <Text style={styles.primaryActionText}>
                {currentStepData.actionBtn}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ARCanvas3DEngine>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  backText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  timerBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  timerText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  langBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  langText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  stepProgressContainer: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  stepProgressText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  stepTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  stepFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  hudInstructionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 0, 0.4)',
  },
  hudTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  hudInstruction: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  extinguisherGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  extCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  extCardActive: {
    borderColor: colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  extTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  extTag: {
    color: '#94A3B8',
    fontSize: 11,
  },
  sprayControlBox: {
    gap: 8,
  },
  gaugeBarRow: {
    alignItems: 'center',
    marginBottom: 4,
  },
  gaugeLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sprayTriggerBtn: {
    backgroundColor: colors.primary,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  sprayTriggerBtnActive: {
    backgroundColor: colors.primaryDark,
  },
  sprayTriggerText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  primaryActionBtn: {
    backgroundColor: colors.primary,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryActionText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { submitTrainingResult } from "../services/training";

const QUESTIONS = [
    {
        question: "What should you do first when you discover a fire?",
        options: [
            "Try to extinguish it immediately",
            "Raise the alarm",
            "Run away without informing anyone",
            "Open all doors and windows",
        ],
        answer: 1,
    },
    {
        question: "Which action is unsafe during a fire emergency?",
        options: [
            "Raise the alarm",
            "Follow the evacuation route",
            "Use an appropriate extinguisher",
            "Ignore the alarm",
        ],
        answer: 3,
    },
    {
        question: "What should you check before using a fire extinguisher?",
        options: [
            "Whether it is suitable for the fire",
            "Its colour only",
            "Its weight only",
            "Nothing",
        ],
        answer: 0,
    },
    {
        question: "Where should you aim when using a fire extinguisher?",
        options: [
            "At the top of the flames",
            "At the smoke",
            "At the base of the fire",
            "At the ceiling",
        ],
        answer: 2,
    },
    {
        question: "What should you do if the fire becomes too large to control?",
        options: [
            "Continue fighting it",
            "Evacuate and alert emergency personnel",
            "Hide nearby",
            "Open fuel containers",
        ],
        answer: 1,
    },
    {
        question: "Why is an emergency alarm important?",
        options: [
            "It warns people about danger",
            "It stops the fire automatically",
            "It opens the building",
            "It turns off electricity automatically",
        ],
        answer: 0,
    },
    {
        question: "During evacuation, you should:",
        options: [
            "Use the designated emergency route",
            "Use an elevator",
            "Return for personal belongings",
            "Run toward the fire",
        ],
        answer: 0,
    },
    {
        question: "What should you do with smoke during evacuation?",
        options: [
            "Move through the safest available route",
            "Stand upright in heavy smoke",
            "Open every door",
            "Ignore the smoke",
        ],
        answer: 0,
    },
    {
        question: "Who should attempt to fight a workplace fire?",
        options: [
            "Anyone nearby",
            "Only trained personnel when it is safe",
            "Visitors",
            "Untrained workers only",
        ],
        answer: 1,
    },
    {
        question: "After evacuating, you should:",
        options: [
            "Return immediately",
            "Wait at the designated safe area",
            "Go back for equipment",
            "Enter another building",
        ],
        answer: 1,
    },
];

export default function AssessmentScreen() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const question = QUESTIONS[currentQuestion];

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
    };

    const handleNext = () => {
        if (selectedAnswer === null) return;

        const newScore =
            score + (selectedAnswer === question.answer ? 1 : 0);

        if (currentQuestion === QUESTIONS.length - 1) {
            setScore(newScore);
            setFinished(true);

            const finalPercentage = Math.round(
                (newScore / QUESTIONS.length) * 100
            );
            const passed = finalPercentage >= 70;

            submitTrainingResult({
                moduleId: "FIRE_01",
                score: finalPercentage,
                duration: 10,
                correctActions: newScore,
                wrongActions: QUESTIONS.length - newScore,
                safetyViolations: 0,
                status: passed ? "passed" : "failed",
            }).catch((err) => {
                console.error("Failed to submit training result:", err);
            });
            return;
        }

        setScore(newScore);
        setSelectedAnswer(null);
        setCurrentQuestion(currentQuestion + 1);
    };

    const percentage = Math.round(
        (score / QUESTIONS.length) * 100
    );

    if (finished) {
        const passed = percentage >= 70;

        return (
            <View style={styles.container}>
                <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>
                        ASSESSMENT COMPLETE
                    </Text>

                    <Text style={styles.resultTitle}>
                        {passed ? "Training Passed" : "Training Failed"}
                    </Text>

                    <Text style={styles.score}>
                        {percentage}%
                    </Text>

                    <Text style={styles.resultText}>
                        You answered {score} out of{" "}
                        {QUESTIONS.length} questions correctly.
                    </Text>

                    <View
                        style={[
                            styles.resultBox,
                            passed
                                ? styles.passBox
                                : styles.failBox,
                        ]}
                    >
                        <Text style={styles.resultBoxTitle}>
                            {passed
                                ? "✓ CERTIFICATION ELIGIBLE"
                                : "⚠ RETRAINING REQUIRED"}
                        </Text>

                        <Text style={styles.resultBoxText}>
                            {passed
                                ? "You have successfully completed the Fire & Explosion Response training."
                                : "Please complete the practical training again and retake the assessment."}
                        </Text>
                    </View>

                    {passed ? (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                                router.replace("/certificate")
                            }
                        >
                            <Text style={styles.buttonText}>
                                GET CERTIFICATE
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                                router.replace("/ar/preparation")
                            }
                        >
                            <Text style={styles.buttonText}>
                                RETRAIN
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.step}>
                    FIRE SAFETY ASSESSMENT
                </Text>

                <Text style={styles.title}>
                    Knowledge Check
                </Text>

                <Text style={styles.progress}>
                    Question {currentQuestion + 1} of{" "}
                    {QUESTIONS.length}
                </Text>

                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${((currentQuestion + 1) /
                                        QUESTIONS.length) *
                                    100
                                    }%`,
                            },
                        ]}
                    />
                </View>

                <View style={styles.questionCard}>
                    <Text style={styles.question}>
                        {question.question}
                    </Text>

                    {question.options.map((option, index) => {
                        const selected =
                            selectedAnswer === index;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.option,
                                    selected &&
                                    styles.selectedOption,
                                ]}
                                onPress={() =>
                                    handleAnswer(index)
                                }
                            >
                                <View
                                    style={[
                                        styles.optionCircle,
                                        selected &&
                                        styles.selectedCircle,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionLetter,
                                            selected &&
                                            styles.selectedLetter,
                                        ]}
                                    >
                                        {String.fromCharCode(
                                            65 + index
                                        )}
                                    </Text>
                                </View>

                                <Text style={styles.optionText}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedAnswer === null &&
                        styles.buttonDisabled,
                    ]}
                    disabled={selectedAnswer === null}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        {currentQuestion === QUESTIONS.length - 1
                            ? "SUBMIT ASSESSMENT"
                            : "NEXT QUESTION"}
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

    step: {
        color: "#ff8a00",
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 1,
        marginTop: 20,
        marginBottom: 8,
    },

    title: {
        color: "#ffffff",
        fontSize: 30,
        fontWeight: "900",
        marginBottom: 8,
    },

    progress: {
        color: "#999999",
        fontSize: 14,
        marginBottom: 10,
    },

    progressBar: {
        height: 6,
        backgroundColor: "#292929",
        borderRadius: 5,
        marginBottom: 25,
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#ff8a00",
    },

    questionCard: {
        backgroundColor: "#121212",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#292929",
        padding: 18,
        marginBottom: 25,
    },

    question: {
        color: "#ffffff",
        fontSize: 19,
        fontWeight: "700",
        lineHeight: 27,
        marginBottom: 22,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#333333",
        borderRadius: 12,
        padding: 13,
        marginBottom: 10,
    },

    selectedOption: {
        borderColor: "#ff8a00",
        backgroundColor: "#241b10",
    },

    optionCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: "#555555",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    selectedCircle: {
        backgroundColor: "#ff8a00",
        borderColor: "#ff8a00",
    },

    optionLetter: {
        color: "#999999",
        fontWeight: "700",
    },

    selectedLetter: {
        color: "#000000",
    },

    optionText: {
        flex: 1,
        color: "#dddddd",
        fontSize: 14,
        lineHeight: 20,
    },

    button: {
        height: 55,
        backgroundColor: "#ff8a00",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonDisabled: {
        backgroundColor: "#3a3a3a",
    },

    buttonText: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: 0.5,
    },

    resultContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 25,
    },

    resultLabel: {
        color: "#ff8a00",
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 1,
        textAlign: "center",
    },

    resultTitle: {
        color: "#ffffff",
        fontSize: 30,
        fontWeight: "900",
        textAlign: "center",
        marginTop: 10,
    },

    score: {
        color: "#ff8a00",
        fontSize: 64,
        fontWeight: "900",
        textAlign: "center",
        marginVertical: 15,
    },

    resultText: {
        color: "#aaaaaa",
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
    },

    resultBox: {
        padding: 18,
        borderRadius: 15,
        marginVertical: 30,
    },

    passBox: {
        backgroundColor: "#132417",
        borderWidth: 1,
        borderColor: "#315f3b",
    },

    failBox: {
        backgroundColor: "#241714",
        borderWidth: 1,
        borderColor: "#63352d",
    },

    resultBoxTitle: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "800",
        marginBottom: 8,
    },

    resultBoxText: {
        color: "#bbbbbb",
        fontSize: 13,
        lineHeight: 20,
    },
});
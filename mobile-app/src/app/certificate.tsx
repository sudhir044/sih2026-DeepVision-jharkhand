import React, { useEffect, useState } from "react";
import {
    Alert,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { router } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import qrcode from "qrcode-generator";
import QRCode from "react-native-qrcode-svg";

import { getCurrentUser, getToken } from "../services/auth";
import { apiRequest } from "../services/api";
import { API_BASE_URL } from "../constants/config";

type CertificateData = {
    certificateId: string;
    moduleId: string;
    score: number;
    verificationHash?: string;
    issuedAt?: string;
};

type UserData = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type TrainingResult = {
    id: number;
    user_id?: number;
    module_id?: string;
    moduleId?: string;
    score: number;
    duration?: number;
    correct_actions?: number;
    wrong_actions?: number;
    safety_violations?: number;
    status?: string;
    completed_at?: string;
};

function generateQrSvg(value: string) {
    const qr = qrcode(0, "M");

    qr.addData(value);
    qr.make();

    return qr.createSvgTag(4, 0);
}

export default function CertificateScreen() {
    const [user, setUser] = useState<UserData | null>(null);
    const [result, setResult] = useState<TrainingResult | null>(null);
    const [certificate, setCertificate] =
        useState<CertificateData | null>(null);

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadCertificateData();
    }, []);

    const loadCertificateData = async () => {
        try {
            setLoading(true);

            // Get logged-in user
            const userResponse = await getCurrentUser();

            const currentUser =
                userResponse?.user || userResponse;

            setUser(currentUser);

            // Get training history
            const token = await getToken();

            if (!token) {
                throw new Error("Login session expired.");
            }

            const historyResponse = await apiRequest(
                "/api/training/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const history =
                historyResponse?.results ||
                historyResponse?.data ||
                historyResponse?.history ||
                [];

            if (!history.length) {
                throw new Error(
                    "No completed training result found."
                );
            }

            // Latest training result
            const latestResult = history[0];

            setResult(latestResult);

            // Get module ID
            const moduleId =
                latestResult.module_id ||
                latestResult.moduleId;

            if (!moduleId) {
                throw new Error(
                    "Training module information is missing."
                );
            }

            // Ask backend to create/get certificate.
            // IMPORTANT:
            // Score is NOT sent from the mobile app.
            // Backend uses the stored training result.
            const certificateResponse = await apiRequest(
                "/api/certificates",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        moduleId,
                    }),
                }
            );

            const certificateData =
                certificateResponse?.certificate ||
                certificateResponse?.data ||
                certificateResponse;

            setCertificate(certificateData);
        } catch (error) {
            console.error(
                "Certificate loading error:",
                error
            );

            Alert.alert(
                "Certificate Error",
                error instanceof Error
                    ? error.message
                    : "Unable to load certificate."
            );
        } finally {
            setLoading(false);
        }
    };

    const generateCertificatePDF = async () => {
        if (!user || !result || !certificate) {
            Alert.alert(
                "Certificate Not Ready",
                "Certificate information is still loading."
            );
            return;
        }

        try {
            setGenerating(true);

            const participantName = user.name;

            const score =
                certificate.score ?? result.score;

            const certificateId =
                certificate.certificateId;

            const moduleId =
                result.module_id ||
                result.moduleId ||
                certificate.moduleId;

            const moduleName =
                moduleId === "FIRE_01"
                    ? "Fire & Explosion Response"
                    : moduleId === "GAS_01"
                    ? "Gas Leak & Confined Space Protocol"
                    : moduleId;

            const issuedDate = certificate.issuedAt
                ? new Date(
                    certificate.issuedAt
                ).toLocaleDateString("en-IN")
                : new Date().toLocaleDateString(
                    "en-IN"
                );

            /*
             * Public verification URL.
             *
             * The QR opens your backend verification endpoint.
             */
            const verificationUrl =
                `${API_BASE_URL}/api/certificates/verify/${certificateId}`;

            const html = `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<style>

@page {
    size: A4 landscape;
    margin: 0;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
}

.certificate {
    width: 297mm;
    height: 210mm;
    display: flex;
    background: #ffffff;
    overflow: hidden;
}

.left {
    width: 68%;
    padding: 25mm 18mm 12mm 20mm;
}

.right {
    width: 32%;
    background: linear-gradient(
        145deg,
        #080808,
        #211106,
        #ff5700
    );
    color: white;
    position: relative;
    padding: 15mm 10mm;
}

.logo {
    width: 18mm;
    height: 18mm;
    border-radius: 5mm;
    background: #ff8a00;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: bold;
}

.brand {
    display: flex;
    align-items: center;
    gap: 5mm;
    margin-bottom: 12mm;
}

.brandName {
    font-size: 21px;
    font-weight: bold;
    letter-spacing: 3px;
}

.orange {
    color: #ff8a00;
}

.label {
    color: #666666;
    font-size: 11px;
    letter-spacing: 4px;
    font-weight: bold;
}

.title {
    color: #111111;
    font-size: 40px;
    font-weight: 900;
    margin-top: 3mm;
}

.subtitle {
    color: #777777;
    font-size: 14px;
    letter-spacing: 3px;
    margin-top: 2mm;
}

.presented {
    color: #666666;
    font-size: 11px;
    margin-top: 12mm;
}

.name {
    color: #111111;
    font-size: 27px;
    margin-top: 4mm;
    font-weight: 500;
}

.line {
    width: 115mm;
    border-bottom: 1px solid #cccccc;
    margin-top: 2mm;
}

.description {
    color: #4d4d4d;
    font-size: 11px;
    line-height: 1.6;
    width: 115mm;
    margin-top: 6mm;
}

.module {
    color: #222222;
    font-size: 12px;
    font-weight: bold;
    margin-top: 6mm;
}

.moduleName {
    color: #ff8a00;
}

.info {
    display: flex;
    gap: 25mm;
    margin-top: 8mm;
}

.infoLabel {
    color: #999999;
    font-size: 8px;
    letter-spacing: 1px;
}

.infoValue {
    color: #222222;
    font-size: 12px;
    font-weight: bold;
    margin-top: 2mm;
}

.rightTop {
    color: #aaaaaa;
    font-size: 8px;
    letter-spacing: 1.5px;
}

.rightBrand {
    font-size: 25px;
    font-weight: 900;
    letter-spacing: 2px;
    margin-top: 10mm;
}

.safety {
    color: #999999;
    font-size: 8px;
    letter-spacing: 1px;
    margin-top: 2mm;
}

.badge {
    width: 42mm;
    height: 42mm;
    border: 2px solid #ff8a00;
    border-radius: 50%;
    margin: 17mm auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #ffffff;
    font-size: 9px;
    font-weight: bold;
}

.scoreLabel {
    color: #bbbbbb;
    font-size: 8px;
    letter-spacing: 1px;
    margin-top: 12mm;
    text-align: center;
}

.score {
    color: #ff8a00;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-top: 2mm;
}

.qrBox {
    position: absolute;
    right: 10mm;
    bottom: 10mm;
    background: #ffffff;
    padding: 3mm;
    width: 30mm;
    height: 30mm;
}

.qr {
    width: 24mm;
    height: 24mm;
}

.id {
    position: absolute;
    left: 10mm;
    bottom: 12mm;
    right: 45mm;
    color: #dddddd;
    font-size: 7px;
    border-top: 1px solid rgba(255,255,255,0.3);
    padding-top: 3mm;
}

.footer {
    margin-top: 8mm;
    color: #888888;
    font-size: 7px;
}

</style>

</head>

<body>

<div class="certificate">

    <div class="left">

        <div class="brand">

            <div class="logo">
                D
            </div>

            <div class="brandName">
                DEEP<span class="orange">VISION</span>
            </div>

        </div>

        <div class="label">
            CERTIFICATE
        </div>

        <div class="title">
            OF COMPLETION
        </div>

        <div class="subtitle">
            INDUSTRIAL SAFETY TRAINING
        </div>

        <div class="presented">
            This certificate is proudly presented to
        </div>

        <div class="name">
            ${participantName}
        </div>

        <div class="line"></div>

        <div class="description">
            In recognition of successfully completing
            the DeepVision AR-based vocational safety
            training program and demonstrating knowledge
            of safe workplace practices.
        </div>

        <div class="module">
            Training Module:
            <span class="moduleName">
                ${moduleName}
            </span>
        </div>

        <div class="info">

            <div>
                <div class="infoLabel">
                    ASSESSMENT SCORE
                </div>

                <div class="infoValue">
                    ${score}%
                </div>
            </div>

            <div>
                <div class="infoLabel">
                    ISSUE DATE
                </div>

                <div class="infoValue">
                    ${issuedDate}
                </div>
            </div>

        </div>

        <div class="footer">
            DEEPVISION • INDUSTRIAL SAFETY TRAINING
            • SIH26041 • JHARKHAND
        </div>

    </div>


    <div class="right">

        <div class="rightTop">
            AR-BASED VOCATIONAL TRAINING
        </div>

        <div class="rightBrand">
            DEEP<span class="orange">VISION</span>
        </div>

        <div class="safety">
            SAFETY • SKILL • EXPERIENCE
        </div>

        <div class="badge">
            TRAINING<br>
            COMPLETED
        </div>

        <div class="scoreLabel">
            ASSESSMENT SCORE
        </div>

        <div class="score">
            ${score}%
        </div>

        <div class="id">
            Certificate ID:
            <strong>${certificateId}</strong>
        </div>

    </div>

</div>

</body>
</html>
`;

            /*
             * QR code is generated separately as SVG.
             * For the PDF we generate an HTML QR using
             * a simple external-free SVG generated below.
             */

            const qrSvg = await createQRCodeSvg(
                verificationUrl
            );

            const finalHtml = html.replace(
                '<div class="qrBox">',
                `<div class="qrBox">
                    ${qrSvg}`
            );

            const { uri } =
                await Print.printToFileAsync({
                    html: finalHtml,
                    width: 842,
                    height: 595,
                });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: "application/pdf",
                    dialogTitle:
                        "DeepVision Certificate",
                    UTI: "com.adobe.pdf",
                });
            } else {
                Alert.alert(
                    "Certificate Generated",
                    "PDF generated successfully."
                );
            }

        } catch (error) {
            console.error(
                "PDF generation error:",
                error
            );

            Alert.alert(
                "Error",
                "Unable to generate certificate PDF."
            );
        } finally {
            setGenerating(false);
        }
    };

    /*
     * Simple QR placeholder for now.
     *
     * IMPORTANT:
     * The on-screen QR uses the real verification URL.
     * For production PDF, we will embed the actual QR SVG.
     */
    const createQRCodeSvg = async (
        value: string
    ) => {
        /*
         * This will be replaced by a real QR SVG
         * export once PDF QR embedding is finalized.
         *
         * For now, keep the verification URL
         * available as text.
         */
        return `
            <div style="
                width:24mm;
                height:24mm;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:6px;
                color:#111;
                text-align:center;
            ">
                SCAN TO VERIFY<br/>
                ${value}
            </div>
        `;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#ff8a00"
                />

                <Text style={styles.loadingText}>
                    Preparing certificate...
                </Text>
            </View>
        );
    }

    if (!user || !result || !certificate) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorTitle}>
                    Certificate unavailable
                </Text>

                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={loadCertificateData}
                >
                    <Text style={styles.generateText}>
                        TRY AGAIN
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const participantName = user.name;

    const score =
        certificate.score ?? result.score;

    const certificateId =
        certificate.certificateId;

    const moduleId =
        result.module_id ||
        result.moduleId ||
        certificate.moduleId;

    const moduleName =
        moduleId === "FIRE_01"
            ? "Fire & Explosion Response"
            : moduleId === "GAS_01"
            ? "Gas Leak & Confined Space Protocol"
            : moduleId;

    const verificationUrl =
        `${API_BASE_URL}/api/certificates/verify/${certificateId}`;

    const issuedDate = certificate.issuedAt
        ? new Date(
            certificate.issuedAt
        ).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString(
            "en-IN"
        );

    return (
        <View style={styles.container}>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={styles.back}>
                        ‹
                    </Text>

                    <Text style={styles.backText}>
                        Back
                    </Text>
                </TouchableOpacity>


                {/* Certificate Preview */}

                <View style={styles.preview}>

                    <View style={styles.previewLeft}>

                        <View style={styles.brandRow}>

                            <View style={styles.logo}>
                                <Text style={styles.logoText}>
                                    D
                                </Text>
                            </View>

                            <Text style={styles.brandText}>
                                DEEP
                                <Text style={styles.orange}>
                                    VISION
                                </Text>
                            </Text>

                        </View>

                        <Text style={styles.smallTitle}>
                            CERTIFICATE
                        </Text>

                        <Text style={styles.bigTitle}>
                            OF COMPLETION
                        </Text>

                        <Text style={styles.previewSubtitle}>
                            INDUSTRIAL SAFETY TRAINING
                        </Text>

                        <Text style={styles.presented}>
                            This certificate is proudly presented to
                        </Text>

                        <Text style={styles.name}>
                            {participantName}
                        </Text>

                        <Text style={styles.description}>
                            In recognition of successfully
                            completing the DeepVision AR-based
                            vocational safety training program.
                        </Text>

                        <Text style={styles.module}>
                            {moduleName}
                        </Text>

                        <View style={styles.infoRow}>

                            <View>
                                <Text style={styles.infoLabel}>
                                    SCORE
                                </Text>

                                <Text style={styles.infoValue}>
                                    {score}%
                                </Text>
                            </View>

                            <View>
                                <Text style={styles.infoLabel}>
                                    ISSUE DATE
                                </Text>

                                <Text style={styles.infoValue}>
                                    {issuedDate}
                                </Text>
                            </View>

                        </View>

                    </View>


                    <View style={styles.previewRight}>

                        <Text style={styles.arLabel}>
                            AR-BASED VOCATIONAL TRAINING
                        </Text>

                        <Text style={styles.previewBrand}>
                            DEEP
                            <Text style={styles.orange}>
                                VISION
                            </Text>
                        </Text>

                        <Text style={styles.safetyText}>
                            SAFETY • SKILL • EXPERIENCE
                        </Text>

                        <View style={styles.completedCircle}>
                            <Text style={styles.completedText}>
                                TRAINING{"\n"}COMPLETED
                            </Text>
                        </View>

                        <Text style={styles.scoreLabel}>
                            SCORE
                        </Text>

                        <Text style={styles.previewScore}>
                            {score}%
                        </Text>

                    </View>

                </View>


                {/* Certificate ID */}

                <View style={styles.idCard}>

                    <View>
                        <Text style={styles.idLabel}>
                            CERTIFICATE ID
                        </Text>

                        <Text style={styles.idValue}>
                            {certificateId}
                        </Text>
                    </View>

                    <QRCode
                        value={verificationUrl}
                        size={85}
                        backgroundColor="white"
                        color="black"
                    />

                </View>


                {/* Verification URL */}

                <View style={styles.verifyCard}>

                    <Text style={styles.verifyTitle}>
                        QR VERIFICATION
                    </Text>

                    <Text style={styles.verifyText}>
                        Scan the QR code to verify this
                        certificate.
                    </Text>

                    <Text style={styles.verifyUrl}>
                        {verificationUrl}
                    </Text>

                </View>


                {/* Generate PDF */}

                <TouchableOpacity
                    style={[
                        styles.generateButton,
                        generating &&
                        styles.disabledButton,
                    ]}
                    onPress={generateCertificatePDF}
                    disabled={generating}
                >

                    <Text style={styles.generateText}>
                        {generating
                            ? "GENERATING PDF..."
                            : "GENERATE CERTIFICATE PDF"}
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

    loadingContainer: {
        flex: 1,
        backgroundColor: "#080808",
        alignItems: "center",
        justifyContent: "center",
        padding: 25,
    },

    loadingText: {
        color: "#aaaaaa",
        marginTop: 15,
    },

    errorTitle: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 20,
    },

    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    back: {
        color: "#ffffff",
        fontSize: 38,
    },

    backText: {
        color: "#aaaaaa",
        marginLeft: 5,
    },

    preview: {
        flexDirection: "row",
        height: 390,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "#ffffff",
    },

    previewLeft: {
        flex: 2.1,
        padding: 20,
    },

    previewRight: {
        flex: 1,
        backgroundColor: "#1a0d05",
        padding: 20,
        justifyContent: "center",
    },

    brandRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    logo: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#ff8a00",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },

    logoText: {
        color: "#000000",
        fontSize: 21,
        fontWeight: "900",
    },

    brandText: {
        color: "#111111",
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 1,
    },

    orange: {
        color: "#ff8a00",
    },

    smallTitle: {
        color: "#555555",
        fontSize: 10,
        letterSpacing: 2,
        fontWeight: "800",
    },

    bigTitle: {
        color: "#111111",
        fontSize: 27,
        fontWeight: "900",
    },

    previewSubtitle: {
        color: "#777777",
        fontSize: 9,
        letterSpacing: 1.5,
        marginTop: 2,
    },

    presented: {
        color: "#777777",
        fontSize: 9,
        marginTop: 18,
    },

    name: {
        color: "#171717",
        fontSize: 20,
        fontWeight: "500",
        marginTop: 6,
    },

    description: {
        color: "#555555",
        fontSize: 9,
        lineHeight: 14,
        marginTop: 12,
    },

    module: {
        color: "#ff8a00",
        fontSize: 11,
        fontWeight: "800",
        marginTop: 12,
    },

    infoRow: {
        flexDirection: "row",
        gap: 45,
        marginTop: 18,
    },

    infoLabel: {
        color: "#999999",
        fontSize: 8,
    },

    infoValue: {
        color: "#222222",
        fontSize: 12,
        fontWeight: "800",
        marginTop: 3,
    },

    arLabel: {
        color: "#aaaaaa",
        fontSize: 7,
        textAlign: "center",
    },

    previewBrand: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "900",
        textAlign: "center",
        marginTop: 12,
    },

    safetyText: {
        color: "#888888",
        fontSize: 7,
        textAlign: "center",
        marginTop: 4,
    },

    completedCircle: {
        width: 92,
        height: 92,
        borderRadius: 46,
        borderWidth: 2,
        borderColor: "#ff8a00",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 30,
    },

    completedText: {
        color: "#ffffff",
        textAlign: "center",
        fontSize: 9,
        fontWeight: "800",
        lineHeight: 14,
    },

    scoreLabel: {
        color: "#aaaaaa",
        fontSize: 8,
        textAlign: "center",
        marginTop: 22,
    },

    previewScore: {
        color: "#ff8a00",
        fontSize: 25,
        fontWeight: "900",
        textAlign: "center",
        marginTop: 3,
    },

    idCard: {
        backgroundColor: "#121212",
        borderWidth: 1,
        borderColor: "#292929",
        borderRadius: 14,
        padding: 16,
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    idLabel: {
        color: "#777777",
        fontSize: 9,
        letterSpacing: 1,
    },

    idValue: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "700",
        marginTop: 6,
    },

    verifyCard: {
        backgroundColor: "#121212",
        borderWidth: 1,
        borderColor: "#292929",
        borderRadius: 14,
        padding: 16,
        marginTop: 12,
        marginBottom: 15,
    },

    verifyTitle: {
        color: "#ff8a00",
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1,
    },

    verifyText: {
        color: "#aaaaaa",
        fontSize: 12,
        marginTop: 7,
    },

    verifyUrl: {
        color: "#666666",
        fontSize: 9,
        marginTop: 8,
    },

    generateButton: {
        height: 56,
        borderRadius: 12,
        backgroundColor: "#ff8a00",
        alignItems: "center",
        justifyContent: "center",
    },

    disabledButton: {
        opacity: 0.5,
    },

    generateText: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: 0.5,
    },

});
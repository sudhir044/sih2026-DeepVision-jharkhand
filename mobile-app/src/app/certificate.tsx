import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function CertificateScreen() {
    const certId = "SAFE-AR-2026-FIRE01";
    const date = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.replace("/home")}>
                        <Text style={styles.close}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Certificate of Completion</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Certificate Card */}
                <View style={styles.certCard}>

                    <View style={styles.badgeRow}>
                        <Text style={styles.certBadge}>SIH 2026 • OFFICIAL</Text>
                        <Text style={styles.statusBadge}>VERIFIED ✓</Text>
                    </View>

                    <Text style={styles.orgName}>DEEPVISION JHARKHAND</Text>
                    <Text style={styles.subOrg}>Department of Higher & Technical Education</Text>

                    <View style={styles.divider} />

                    <Text style={styles.certifyText}>This is to certify that</Text>
                    <Text style={styles.recipientName}>Employee / Worker</Text>
                    <Text style={styles.certifyDesc}>
                        has successfully completed the immersive Augmented Reality vocational training simulation for
                    </Text>

                    <View style={styles.moduleBadge}>
                        <Text style={styles.moduleText}>🔥 Fire & Explosion Response</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>SCORE</Text>
                            <Text style={styles.metaValue}>85%</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>DATE</Text>
                            <Text style={styles.metaValue}>{date}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>RESULT</Text>
                            <Text style={[styles.metaValue, { color: "#22C55E" }]}>PASSED</Text>
                        </View>
                    </View>

                    {/* QR Code Placeholder */}
                    <View style={styles.qrSection}>
                        <View style={styles.qrBox}>
                            <Text style={styles.qrIcon}>⬛⬜⬛</Text>
                            <Text style={styles.qrIcon}>⬜⬛⬜</Text>
                            <Text style={styles.qrIcon}>⬛⬜⬛</Text>
                        </View>
                        <View style={styles.qrDetails}>
                            <Text style={styles.certIdLabel}>CERTIFICATE ID</Text>
                            <Text style={styles.certId}>{certId}</Text>
                            <Text style={styles.hashLabel}>SECURE SHA-256 HASH</Text>
                            <Text style={styles.hashText} numberOfLines={1}>
                                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                            </Text>
                        </View>
                    </View>

                </View>

                {/* Actions */}
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => router.replace("/home")}
                >
                    <Text style={styles.doneText}>BACK TO DASHBOARD</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050606",
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 55,
        marginBottom: 20,
    },
    close: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "300",
    },
    headerTitle: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
    certCard: {
        backgroundColor: "#101212",
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: "#FF6600",
        padding: 22,
        alignItems: "center",
    },
    badgeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 16,
    },
    certBadge: {
        color: "#FF6600",
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
    },
    statusBadge: {
        color: "#22C55E",
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
    },
    orgName: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "900",
        letterSpacing: 1.5,
        textAlign: "center",
    },
    subOrg: {
        color: "#888",
        fontSize: 11,
        marginTop: 4,
        textAlign: "center",
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#252525",
        marginVertical: 16,
    },
    certifyText: {
        color: "#777",
        fontSize: 12,
    },
    recipientName: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "800",
        marginTop: 4,
        marginBottom: 8,
    },
    certifyDesc: {
        color: "#AAA",
        fontSize: 12,
        lineHeight: 18,
        textAlign: "center",
        paddingHorizontal: 8,
    },
    moduleBadge: {
        backgroundColor: "#1B1510",
        borderWidth: 1,
        borderColor: "#FF6600",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 14,
        marginBottom: 16,
    },
    moduleText: {
        color: "#FF6600",
        fontSize: 13,
        fontWeight: "700",
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        backgroundColor: "#151717",
        borderRadius: 10,
        paddingVertical: 12,
        marginBottom: 16,
    },
    metaItem: {
        alignItems: "center",
    },
    metaLabel: {
        color: "#777",
        fontSize: 9,
        letterSpacing: 1,
        fontWeight: "700",
    },
    metaValue: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "700",
        marginTop: 4,
    },
    qrSection: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#151717",
        borderRadius: 10,
        padding: 12,
        width: "100%",
    },
    qrBox: {
        width: 54,
        height: 54,
        backgroundColor: "#FFF",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    qrIcon: {
        fontSize: 10,
        lineHeight: 12,
    },
    qrDetails: {
        flex: 1,
    },
    certIdLabel: {
        color: "#777",
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 0.8,
    },
    certId: {
        color: "#FFF",
        fontSize: 11,
        fontWeight: "700",
        marginTop: 2,
    },
    hashLabel: {
        color: "#777",
        fontSize: 8,
        fontWeight: "700",
        letterSpacing: 0.8,
        marginTop: 4,
    },
    hashText: {
        color: "#888",
        fontSize: 9,
        fontFamily: "monospace",
    },
    doneButton: {
        height: 52,
        backgroundColor: "#FF6600",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 22,
    },
    doneText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "800",
        letterSpacing: 1,
    },
});

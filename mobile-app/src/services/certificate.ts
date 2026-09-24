import { apiRequest } from "./api";
import { getToken } from "./auth";

export interface CertificateData {
    certificateId: string;
    certificate_id?: string;
    moduleId: number | string;
    module_id?: number | string;
    score: number;
    verificationHash?: string;
    verification_hash?: string;
    issuedAt?: string;
    issued_at?: string;
}

export async function createCertificate(moduleId: string | number): Promise<CertificateData> {
    const token = await getToken();
    if (!token) {
        throw new Error("Authentication session expired.");
    }

    const data = await apiRequest("/api/certificates", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ moduleId }),
    });

    return data.certificate || data;
}

export async function verifyCertificate(certificateId: string) {
    return await apiRequest(`/api/certificates/verify/${certificateId}`);
}

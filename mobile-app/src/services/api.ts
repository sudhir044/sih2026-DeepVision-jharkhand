import { API_BASE_URL } from "../constants/config";

export async function apiRequest(
    endpoint: string,
    options: RequestInit = {}
) {
    try {
        console.log("API Request:", `${API_BASE_URL}${endpoint}`);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(
                `Server returned invalid response (${response.status})`
            );
        }

        console.log("API Response:", response.status, data);

        if (!response.ok) {
            throw new Error(
                data.message || `Request failed (${response.status})`
            );
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);

        if (error instanceof TypeError) {
            throw new Error(
                "Unable to connect to server. Check Wi-Fi and backend."
            );
        }

        throw error;
    }
}
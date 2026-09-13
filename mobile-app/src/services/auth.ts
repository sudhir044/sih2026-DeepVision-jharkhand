import * as SecureStore from "expo-secure-store";
import { apiRequest } from "./api";

const TOKEN_KEY = "deepvision_token";

export async function login(email: string, password: string) {
    const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!data.success || !data.token) {
        throw new Error(data.message || "Login failed");
    }

    await SecureStore.setItemAsync(TOKEN_KEY, data.token);

    return data;
}

export async function getToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getCurrentUser() {
    const token = await getToken();

    if (!token) {
        return null;
    }

    return await apiRequest("/api/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
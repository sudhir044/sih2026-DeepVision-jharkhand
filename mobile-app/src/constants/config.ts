import { Platform } from "react-native";

// Computer's active Wi-Fi LAN IP address for physical devices
const LAN_IP = "10.197.164.137";

// Web uses localhost; Mobile devices/emulators connect to the LAN IP
export const API_BASE_URL =
    Platform.OS === "web"
        ? "http://localhost:5000"
        : `http://${LAN_IP}:5000`;
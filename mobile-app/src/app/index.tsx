import { StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { login } from "../services/auth";



export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>DEEPVISION</Text>
        <Text style={styles.subtitle}>
          Industrial Safety Training
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Employee Login</Text>

        <Text style={styles.label}>Employee ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          disabled={loading}
          onPress={async () => {
            if (!email || !password) {
              Alert.alert(
                "Missing Details",
                "Please enter email and password."
              );
              return;
            }

            try {
              setLoading(true);

              await login(email, password);

              router.replace("/home");
            } catch (error) {
              Alert.alert(
                "Login Failed",
                error instanceof Error
                  ? error.message
                  : "Unable to login."
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          <Text style={styles.loginText}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        SIH26041 • Jharkhand Industrial Safety
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050606",
    paddingHorizontal: 28,
    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 55,
  },

  logo: {
    color: "#FF6600",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 2,
  },

  subtitle: {
    color: "#A0A0A0",
    fontSize: 14,
    marginTop: 8,
  },

  form: {
    width: "100%",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 28,
  },

  label: {
    color: "#D0D0D0",
    fontSize: 14,
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: "#101212",
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },

  loginButton: {
    height: 54,
    backgroundColor: "#FF6600",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },

  footer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    color: "#666",
    fontSize: 11,
  },
});
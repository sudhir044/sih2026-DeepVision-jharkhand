import { StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
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
          placeholder="Enter Employee ID"
          placeholderTextColor="#777"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#777"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.loginText}>LOGIN</Text>
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
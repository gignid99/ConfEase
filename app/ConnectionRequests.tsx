import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import HeaderBar from "@/components/HeaderBar";

export default function ConnectionRequests() {
  return (
    <View style={styles.container}>
      <HeaderBar title="Connections" />

      <View style={styles.content}>
        <Image
          source={require("../assets/images/favicon.png")}
          style={styles.avatar}
        />
        <Text style={styles.name}>connect with friend</Text>
        <Text style={styles.subtitle}>Participant</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.buttonTextLight}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton}>
            <Text style={styles.buttonTextDark}>Decline</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>Wants to connect with you</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: "700", color: "#000" },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 12 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  acceptButton: {
    backgroundColor: "#3F51B5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  declineButton: {
    backgroundColor: "#E3E7FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonTextLight: { color: "#fff", fontWeight: "600" },
  buttonTextDark: { color: "#3F51B5", fontWeight: "600" },
  infoText: { marginTop: 10, color: "#555" },
});

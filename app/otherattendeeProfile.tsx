import React from "react";
import { View, Text, StyleSheet, Linking, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function OtherAttendeeProfile() {
  const { fullName, email, about, linkedin, github } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.email}>{email}</Text>
          <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionContent}>
          {about ? <Text style={styles.about}>{about}</Text> : null}
        </Text>
      </View>
        <View style={styles.socialContainer}>
          {linkedin ? (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL(linkedin)}
            >
              <Ionicons name="logo-linkedin" size={22} color="#0077b5" />
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
          ) : null}

          {github ? (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL(github)}
            >
              <Ionicons name="logo-github" size={22} color="black" />
              <Text style={styles.socialText}>GitHub</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  email: { fontSize: 16, color: "gray", textAlign: "center", marginBottom: 10 },
  about: { fontSize: 16, textAlign: "center", marginVertical: 10 },
  socialContainer: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
   section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#007bff",
  },
  sectionContent: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  socialText: { marginLeft: 6, fontSize: 16, color: "#333" },
});

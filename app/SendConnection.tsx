import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import HeaderBar from "@/components/HeaderBar";
import { useRouter } from "expo-router";

export default function SendConnection() {
  const router = useRouter();
   const qrshareprofile=()=>{
    router.push('/ConnectionRequests');

 }
  return (
    <View style={styles.container}>
      <HeaderBar title="Send Connection" />

      <View style={styles.content}>
        <Image
          source={require("../assets/images/favicon.png")}
          style={styles.avatar}
        />
        <Text style={styles.name}>you are ready to connect</Text>
        <Text style={styles.subtitle}>Send Connection Request to Connect</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={qrshareprofile}>
          <Text style={styles.primaryButtonText}>Send Connection Request</Text>
        </TouchableOpacity>
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
  subtitle: { fontSize: 14, color: "#555", marginVertical: 8, textAlign: "center" },
  primaryButton: {
    backgroundColor: "#3F51B5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
});

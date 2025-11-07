import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function ShareProfileScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const screenWidth = Dimensions.get("window").width;

  const [userData, setUserData] = useState<{ fullName: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.warn("No logged-in user found.");
          setLoading(false);
          return;
        }

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as { fullName: string; email: string });
        } else {
          console.warn("No user data found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: "red", fontSize: 16 }}>No user data found</Text>
      </View>
    );
  }

  const qrValue = JSON.stringify({
    uid: auth.currentUser?.uid,
    fullName: userData.fullName,
    email: userData.email,
  });

  return (
    <View style={[styles.container, isWeb && styles.webContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Profile</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.content}>
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/219/219986.png" }} style={styles.avatar} />
        <Text style={styles.name}>{userData.fullName}</Text>
        <Text style={{ color: "#6b7280", marginBottom: 24 }}>{userData.email}</Text>

        <View style={styles.qrContainer}>
          <QRCode value={qrValue} size={180} />
        </View>

        <Text style={styles.instructions}>Scan QR Code to get my information</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  webContainer: {
    width: "100%",
    maxWidth: 400,
    marginHorizontal: "auto",
    marginVertical: 40,
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  header: {
    backgroundColor: "#4f46e5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  qrContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  instructions: {
    marginTop: 24,
    fontSize: 14,
    color: "#6b7280",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

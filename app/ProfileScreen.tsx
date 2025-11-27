import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import EditProfile, { type Profile } from "./EditProfile";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Firestore data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            name: data.fullName || "",
            about: data.about || "",
            github: data.githubUrl || "",
            linkedin: data.linkedinUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", "Unable to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ When user saves changes in modal, re-fetch from Firestore
  const handleProfileSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          name: data.fullName || "",
          about: data.about || "",
          github: data.githubUrl || "",
          linkedin: data.linkedinUrl || "",
        });
      }
    } catch (e) {
      console.error("Error refreshing profile:", e);
    }
  };

  const openUrl = async (url: string) => {
    if (!url) return;
    let normalized = url;
    if (!/^https?:\/\//i.test(normalized)) {
      if (/^[a-z0-9-_.]+$/i.test(normalized) && !normalized.includes("github.com")) {
        normalized = `https://github.com/${normalized}`;
      } else {
        normalized = `https://${normalized}`;
      }
    }
    try {
      const supported = await Linking.canOpenURL(normalized);
      if (supported) {
        await Linking.openURL(normalized);
      } else {
        Alert.alert("Cannot open link", normalized);
      }
    } catch {
      Alert.alert("Cannot open link", normalized);
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text }}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <>
      {/* Modal Overlay */}
      <Modal
        visible={editing}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <EditProfile
              onClose={() => {
                setEditing(false);
                handleProfileSave(); // 🔁 Refresh data after edit
              }}
            />
          </View>
        </View>
      </Modal>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.background} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.background }]}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={require("../assets/images/splash-icon.png")}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(true)}
          >
            <Ionicons name="create-outline" size={16} color={colors.primary} />
            <Text style={[styles.editText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setActiveTab("about")}
            style={[
              styles.tabButton,
              activeTab === "about" && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "about" && styles.activeTabText,
              ]}
            >
              ABOUT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("interest")}
            style={[
              styles.tabButton,
              activeTab === "interest" && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "interest" && styles.activeTabText,
              ]}
            >
              INTEREST
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "about" ? (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About Me</Text>
            <Text style={[styles.aboutText, { color: colors.text }]}>
              {profile.about || "No information provided."}
            </Text>

            {profile.github ? (
              <TouchableOpacity
                onPress={() => openUrl(profile.github)}
                style={{ marginTop: 12 }}
              >
                 <Text style={[styles.sectionTitle, { color: colors.text }]}>Links</Text>
                 <Text><Text style={{ marginTop: 6, color: colors.text }}>GitHub: </Text>
                 <Text style={[styles.linkText, { color: colors.primary }]}>
                   {profile.github}
                 </Text></Text>
                 
              </TouchableOpacity>
            ) : null}

            {profile.linkedin ? (
              <TouchableOpacity
                onPress={() => openUrl(profile.linkedin)}
                style={{ marginTop: 6 }}
              >
                  <Text>
                    <Text style={{ marginTop: 6, color: colors.text }}>LinkedIn: </Text>
                    <Text style={[styles.linkText, { color: colors.primary }]}>
                  {profile.linkedin}
                 </Text>
                 </Text>
               
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Interest</Text>
            <Text style={{ color: "#555", marginTop: 5 }}>
              Add your interests here.
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", paddingBottom: 40 },
  header: {
    backgroundColor: "#4F46E5",
    height: 54,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    padding: 6,
    zIndex: 5,
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  profileSection: { alignItems: "center", marginTop: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  name: { fontSize: 18, fontWeight: "600", marginTop: 10 },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3b5bff",
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  editText: { color: "#3b5bff", marginLeft: 5 },
  tabs: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  tabButton: {
    paddingBottom: 8,
    paddingHorizontal: 25,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: { borderBottomColor: "#4F46E5" },
  tabText: { color: "#777" },
  activeTabText: { color: "#4F46E5", fontWeight: "600" },
  content: { paddingHorizontal: 20, marginTop: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  aboutText: { marginTop: 5, color: "#555" },
  linkText: { color: "#2563eb", marginTop: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

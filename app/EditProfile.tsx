import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // ✅ adjust the path as needed

// Define the profile type
export type Profile = {
  name: string;
  about: string;
  github: string;
  linkedin: string;
};

export default function EditProfileScreen({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    about: "",
    github: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  // ✅ Fetch user data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
  }, [user]);

  // ✅ Save updated data to Firestore
  const handleSave = async () => {
    if (!profile.name.trim()) {
      Alert.alert("Validation", "Name cannot be empty");
      return;
    }

    try {
      if (!user) return;
      setSaving(true);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        fullName: profile.name.trim(),
        about: profile.about.trim(),
        githubUrl: profile.github.trim(),
        linkedinUrl: profile.linkedin.trim(),
      });

      Alert.alert("Success", "Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Profile</Text>

      <Text style={styles.sectionTitle}>Full Name</Text>
      <TextInput
        value={profile.name}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        placeholder="Enter full name"
        style={styles.input}
        returnKeyType="done"
      />

      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>About</Text>
      <TextInput
        value={profile.about}
        onChangeText={(text) => setProfile({ ...profile, about: text })}
        placeholder="A short bio"
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
      />

      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
        GitHub (url or username)
      </Text>
      <TextInput
        value={profile.github}
        onChangeText={(text) => setProfile({ ...profile, github: text })}
        placeholder="https://github.com/username or username"
        style={styles.input}
        autoCapitalize="none"
      />

      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
        LinkedIn (url)
      </Text>
      <TextInput
        value={profile.linkedin}
        onChangeText={(text) => setProfile({ ...profile, linkedin: text })}
        placeholder="https://www.linkedin.com/in/username"
        style={styles.input}
        autoCapitalize="none"
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={{ color: "#333" }}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

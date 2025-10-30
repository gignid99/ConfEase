import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db, auth } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditEventScreen() {
  const { id } = useLocalSearchParams(); // event ID from route
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;

        const eventRef = doc(db, "events", id as string);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          const data = eventSnap.data();
          setTitle(data.title || "");
          setDescription(data.description || "");
          setDate(data.date || "");
          setLocation(data.location || "");

          const user = auth.currentUser;
          if (user && data.createdBy === user.uid) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        } else {
          Alert.alert("Not Found", "This event no longer exists.");
          router.back();
        }
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSave = async () => {
    if (!isOwner) {
      Alert.alert("Permission Denied", "You are not allowed to edit this event.");
      return;
    }

    if (!title || !description || !date || !location) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    setSaving(true);
    try {
      const eventRef = doc(db, "events", id as string);
      await updateDoc(eventRef, {
        title,
        description,
        date,
        location,
        updatedAt: new Date(),
      });

      Alert.alert("Success", "Event updated successfully!");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 10, color: "#6b7280" }}>Loading event...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Event</Text>

      {!isOwner && (
        <Text style={styles.warningText}>
          You don’t have permission to edit this event.
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        editable={isOwner}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        multiline
        editable={isOwner}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        editable={isOwner}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        editable={isOwner}
        value={location}
        onChangeText={setLocation}
      />

      {isOwner && (
        <TouchableOpacity
          style={[styles.button, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  warningText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
});

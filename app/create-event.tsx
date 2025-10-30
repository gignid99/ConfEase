import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth, storage } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CreateEventScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick image from gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Date picker change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // Create event and upload image to Firebase
  const handleCreateEvent = async () => {
    if (!title || !description || !location) {
      Alert.alert("Missing Fields", "Please fill all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in as an organizer.");
        return;
      }

      let imageUrl = "";
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `eventImages/${Date.now()}_${user.uid}.jpg`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "events"), {
        title,
        description,
        location,
        date: date.toISOString(),
        imageUrl,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        status: "active",
      });

      Alert.alert("✅ Success", "Event created successfully!");
      setTitle("");
      setDescription("");
      setLocation("");
      setImage(null);
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F9F9FF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Event</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Event Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event title..."
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter event details..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Upload Image</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadText}>{image ? "Image Selected ✅" : "Choose Image"}</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location..."
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={onDateChange}
          />
        )}

        <TouchableOpacity
          style={[styles.createButton, loading && { opacity: 0.6 }]}
          onPress={handleCreateEvent}
          disabled={loading}
        >
          <Text style={styles.createText}>{loading ? "Creating..." : "Create Event"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9FF",
    padding: 20,
    ...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 400,
      marginHorizontal: "auto",
      marginVertical: 40,
      borderRadius: 16,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3F51B5",
  },
  label: { fontSize: 16, fontWeight: "500", color: "#333", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    backgroundColor: "#FFF",
    minHeight: 45,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#E3E7FF",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    alignItems: "center",
  },
  uploadText: { color: "#3F51B5", fontWeight: "600" },
  previewImage: { width: "100%", height: 150, marginTop: 10, borderRadius: 8 },
  dateButton: {
    backgroundColor: "#E3E7FF",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    alignItems: "center",
  },
  dateText: { color: "#3F51B5", fontWeight: "600" },
  createButton: {
    backgroundColor: "#3F51B5",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 25,
  },
  createText: { color: "#FFF", fontSize: 18, fontWeight: "700" },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth, storage } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CreateEvent() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const ampm = ["AM", "PM"];

  const [startHour, setStartHour] = useState("09");
  const [startAmPm, setStartAmPm] = useState("AM");
  const [endHour, setEndHour] = useState("10");
  const [endAmPm, setEndAmPm] = useState("AM");

  // ✅ Convert 12h to 24h to compare
  const to24h = (h: string, p: string) => {
    let hr = parseInt(h);
    if (p === "PM" && hr !== 12) hr += 12;
    if (p === "AM" && hr === 12) hr = 0;
    return hr;
  };

  const validateTimes = (sh: string, sp: string, eh: string, ep: string) => {
    const start = to24h(sh, sp);
    const end = to24h(eh, ep);
    if (end <= start) {
      Alert.alert("Invalid Time", "End time must be later than start time.");
      setEndHour(((start % 12) + 1).toString().padStart(2, "0"));
      setEndAmPm(start >= 11 && start < 23 ? (sp === "AM" ? "PM" : "AM") : sp);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleCreateEvent = async () => {
    if (!title || !description || !location) {
      Alert.alert("Missing Fields", "Please fill all details.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Please login first.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `eventImages/${Date.now()}_${user.uid}.jpg`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      const startTime = `${formattedDate} : ${startHour}:00 ${startAmPm}`;
      const endTime = `${formattedDate} : ${endHour}:00 ${endAmPm}`;

      await addDoc(collection(db, "events"), {
        title,
        description,
        location,
        date: formattedDate,
        startTime,
        endTime,
        imageUrl,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("✅ Success", "Event created successfully!");
      router.back();
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <View style={styles.screen}>
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Event</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Inputs */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Event title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Event description"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
      />

      {/* Date */}
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onDateChange}
        />
      )}

      {/* Time */}
      <Text style={styles.label}>Time (Start → End)</Text>
      <View style={styles.timeRow}>
        <View style={styles.timeBox}>
          <Picker
            selectedValue={startHour}
            onValueChange={(v) => {
              setStartHour(v);
              validateTimes(v, startAmPm, endHour, endAmPm);
            }}
          >
            {hours.map((h) => (
              <Picker.Item key={h} label={`${h}:00`} value={h} />
            ))}
          </Picker>
          <Picker
            selectedValue={startAmPm}
            onValueChange={(v) => {
              setStartAmPm(v);
              validateTimes(startHour, v, endHour, endAmPm);
            }}
          >
            {ampm.map((a) => (
              <Picker.Item key={a} label={a} value={a} />
            ))}
          </Picker>
        </View>

        <Text style={{ marginHorizontal: 8, fontWeight: "600" }}>→</Text>

        <View style={styles.timeBox}>
          <Picker
            selectedValue={endHour}
            onValueChange={(v) => {
              setEndHour(v);
              validateTimes(startHour, startAmPm, v, endAmPm);
            }}
          >
            {hours.map((h) => (
              <Picker.Item key={h} label={`${h}:00`} value={h} />
            ))}
          </Picker>
          <Picker
            selectedValue={endAmPm}
            onValueChange={(v) => {
              setEndAmPm(v);
              validateTimes(startHour, startAmPm, endHour, v);
            }}
          >
            {ampm.map((a) => (
              <Picker.Item key={a} label={a} value={a} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Image Upload */}
      <Text style={styles.label}>Image</Text>
      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        <Text style={styles.uploadText}>
          {image ? "✅ Image Selected" : "Upload Image"}
        </Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.preview} />}

      {/* Submit */}
      <TouchableOpacity
        onPress={handleCreateEvent}
        style={[styles.createButton, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        <Text style={styles.createText}>
          {loading ? "Creating..." : "Create Event"}
        </Text>
      </TouchableOpacity>

      {/* bottom safe padding */}
      <View style={{ height: 40 }} />
    </ScrollView>
  </View>
);

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb", // ✅ fixes black background
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  label: { marginTop: 10, fontWeight: "600", color: "#111827" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    backgroundColor: "#fff",
  },
  dateButton: {
    backgroundColor: "#e0e7ff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  dateText: { color: "#3730a3", fontWeight: "600" },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  timeBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  uploadButton: {
    backgroundColor: "#e0e7ff",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    alignItems: "center",
  },
  uploadText: { color: "#3730a3", fontWeight: "600" },
  preview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  createButton: {
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  createText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

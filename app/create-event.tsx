import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function CreateEvent() {
  const router = useRouter();
  const [about, setAbout] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);

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

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleCreate = () => {
    if (!about) {
      alert("Please enter event details.");
      return;
    }

    alert(`✅ Event Created!\n${about}\nDate: ${date.toDateString()}`);
    router.back(); // navigate back to previous page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Event</Text>

      <Text style={styles.label}>About Conference</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter details about your event..."
        multiline
        value={about}
        onChangeText={setAbout}
      />

      <Text style={styles.label}>Upload Image</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>{image ? "Image Selected ✅" : "Choose Image"}</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

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

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9FF", padding: 20 },
  title: { fontSize: 26, fontWeight: "700", color: "#3F51B5", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "500", color: "#333", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    backgroundColor: "#FFF",
    minHeight: 80,
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

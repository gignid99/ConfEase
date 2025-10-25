import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      <Text style={styles.title}>Create Event</Text>
      
        </View>
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
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9FF", padding: 20,...(Platform.OS === "web" && {
      width: "100%",
      maxWidth: 400,
      marginHorizontal: "auto",
      marginVertical: 40,
      borderRadius: 16,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }), },
  title: { fontSize: 26, fontWeight: "700", color: "#3F51B5", marginTop: 20, textAlign: 'center' },
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
  btn: {
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
},
backButton: {
  position: "absolute",
  left: 0,
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

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [interest, setInterest] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

   {/*if (!result.canceled) {
      setImage(result.assets[0].uri);
    }*/}
  };

  const handleSave = () => {
    const data = { name, about, interest, github, linkedin, image };
    console.log("Profile Updated:", data);
    alert("Profile Updated!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Profile Picture */}
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: "#666" }}>Pick Image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="About"
        value={about}
        onChangeText={setAbout}
        multiline
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Interest"
        value={interest}
        onChangeText={setInterest}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="GitHub URL"
        value={github}
        onChangeText={setGithub}
      />

      <TextInput
        style={styles.input}
        placeholder="LinkedIn URL"
        value={linkedin}
        onChangeText={setLinkedin}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 10,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: "#4b41f1",
    width: "100%",
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

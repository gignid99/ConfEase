import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

export default function ProfileScreen() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("My Full Name");
  const [about, setAbout] = useState("Enjoy your favorite dish and a lovely time...");

  // open editor modal
  const handleEditPress = () => {
    console.log("Edit pressed ✅");
    setEditing(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Name cannot be empty");
      return;
    }
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* Profile Info */}
      <Text style={styles.header}>Profile</Text>

      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{name}</Text>

      <Text style={styles.label}>About:</Text>
      <Text style={styles.value}>{about}</Text>

      <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Modal (Editor) */}
      <Modal
        visible={editing}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.modalTitle}>Edit Profile</Text>

              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Enter full name"
              />

              <Text style={styles.label}>About</Text>
              <TextInput
                value={about}
                onChangeText={setAbout}
                style={[styles.input, { height: 80 }]}
                multiline
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#ccc" }]}
                  onPress={() => setEditing(false)}
                >
                  <Text style={{ color: "#000" }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#4F46E5" }]}
                  onPress={handleSave}
                >
                  <Text style={{ color: "#fff" }}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  editButton: {
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4F46E5",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
});

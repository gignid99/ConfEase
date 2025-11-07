import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Alert,
    TouchableOpacity,
} from "react-native";

// 1. Define and export the Profile type so other files can use it
export type Profile = {
    name: string;
    about: string;
    github: string;
    linkedin: string;
};

// 2. Define the component's props
interface EditProfileProps {
    initial: Profile;
    onClose: () => void;
    onSave: (p: Profile) => void;
}

// 3. Export the component as the default
export default function EditProfile({
    initial,
    onClose,
    onSave,
}: EditProfileProps) {
    const [name, setName] = useState(initial.name);
    const [about, setAbout] = useState(initial.about);
    const [github, setGithub] = useState(initial.github);
    const [linkedin, setLinkedin] = useState(initial.linkedin);

    const save = () => {
        if (!name.trim()) {
            Alert.alert("Validation", "Name cannot be empty");
            return;
        }
        onSave({
            name: name.trim(),
            about: about.trim(),
            github: github.trim(),
            linkedin: linkedin.trim(),
        });
    };

    return (
        // ✅ STYLE PROP REMOVED FROM HERE
        <ScrollView
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.sectionTitle}>Full Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter full name"
                style={styles.input}
                returnKeyType="done"
            />

            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>About</Text>
            <TextInput
                value={about}
                onChangeText={setAbout}
                placeholder="A short bio"
                multiline
                numberOfLines={4}
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            />

            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
                GitHub (url or username)
            </Text>
            <TextInput
                value={github}
                onChangeText={setGithub}
                placeholder="https://github.com/username or username"
                style={styles.input}
                autoCapitalize="none"
            />

            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
                LinkedIn (url)
            </Text>
            <TextInput
                value={linkedin}
                onChangeText={setLinkedin}
                placeholder="https://www.linkedin.com/in/username"
                style={styles.input}
                autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
                <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                    <Text style={{ color: "#333" }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={save} style={styles.saveButton}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

// 4. Copy *only* the styles needed for this component
const styles = StyleSheet.create({
    modalContent: {
        paddingHorizontal: 10,
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
});
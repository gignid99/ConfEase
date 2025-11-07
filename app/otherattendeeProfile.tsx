import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import QRScannerScreen from "./QRScannerScreen";
import { push } from "expo-router/build/global-state/routing";

export default function OtherAttendeeProfile() {
  const router = useRouter();

  const user = {
    name: "Minakshi",
    avatar: "https://cdn-icons-png.flaticon.com/512/219/219986.png",
    about:
      "I’m a software engineer passionate about AI, mobile apps, and community building.",
    linkedin: "https://www.linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    interests: ["AI", "Mobile Development", "Web3", "UI/UX", "Machine Learning"],
  };

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.mobileContainer,
          {
            width: screenWidth < 500 ? screenWidth : 380,
            height: screenHeight < 800 ? screenHeight : 700,
          },
        ]}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() =>push('/QRScannerScreen')}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Attendee Profile</Text>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <Text style={styles.name}>{user.name}</Text>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{user.about}</Text>

            <Text style={styles.sectionTitle}>Social Profiles</Text>
            <Text style={styles.socialLink}>
              <Text style={styles.bold}>LinkedIn: </Text>
              <Text style={styles.link}>{user.linkedin}</Text>
            </Text>
            <Text style={styles.socialLink}>
              <Text style={styles.bold}>GitHub: </Text>
              <Text style={styles.link}>{user.github}</Text>
            </Text>
          </View>

          {/* Interests Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.tagContainer}>
              {user.interests.map((tag, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: colors[index % 5] }]}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const colors = ["#5A67D8", "#F6AD55", "#F56565", "#9F7AEA", "#38B2AC"];

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
  },
  mobileContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  container: {
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 15,
  },
  avatar: {
    width: 70, // smaller image width
    height: 70, // smaller image height
    borderRadius: 35,
    backgroundColor: "#E0E0E0",
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 8,
    color: "#000",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  aboutText: {
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },
  socialLink: {
    color: "#555",
    marginBottom: 6,
  },
  bold: {
    fontWeight: "600",
  },
  link: {
    color: "#1D4ED8",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  tag: {
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 13,
  },
});

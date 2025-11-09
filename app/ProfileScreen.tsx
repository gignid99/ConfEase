import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"about" | "interest">("about");
 const qrshareprofile=()=>{
    router.push('/share-profile');
 }
  const user = {
    name: "Minakshi ",
    qrValue: "https://confEase.app/user/check",
    avatar: "https://cdn-icons-png.flaticon.com/512/219/219986.png",
  };

  return (
   <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require("../assets/images/splash-icon.png")} 
          style={styles.avatar}
        />
        <Text style={styles.name}>Surya</Text>

        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={16} color="#3b5bff" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab("about")}
          style={[styles.tabButton, activeTab === "about" && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>
            ABOUT
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("interest")}
          style={[styles.tabButton, activeTab === "interest" && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === "interest" && styles.activeTabText]}>
            INTEREST
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "about" ? (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>
            Enjoy your favorite dish and a lovely time with friends and family. Food from local food
            trucks will be available for purchase. Read More
          </Text>

          <Text style={styles.sectionTitle}>Social Profile</Text>
          <Text style={styles.socialLink}>
            <Text style={styles.bold}>Linkedin : </Text>
            <Text style={styles.link}>https://www.linkedin.com/in/your-name</Text>
          </Text>
          <Text style={styles.socialLink}>
            <Text style={styles.bold}>GitHub : </Text>
            <Text style={styles.link}>https://github.com/yourusername</Text>
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.interestHeader}>
            <Text style={styles.sectionTitle}>Interest</Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>CHANGE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tagContainer}>
            {["Games Online", "UI/UX", "AI", "ANN", "Mobile Development"].map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors[index] }]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Share Profile Button */}
      <TouchableOpacity style={styles.shareButton} onPress={qrshareprofile}>
        <Text style={styles.shareText}>Share Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const colors = ["#5A67D8", "#F6AD55", "#F56565", "#9F7AEA", "#38B2AC"];

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
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
    marginTop: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E0E0E0",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    color: "#000",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3b5bff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  editText: {
    color: "#3b5bff",
    fontSize: 14,
    marginLeft: 5,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#4F46E5",
  },
  tabText: {
    color: "#777",
    fontSize: 14,
  },
  activeTabText: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom:25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  aboutText: {
    color: "#555",
    lineHeight: 20,
    marginBottom: 15,
  },
  socialLink: {
    color: "#555",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "600",
  },
  link: {
    color: "#1D4ED8",
  },
  interestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  changeText: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 8,
  },
  tag: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: "#fff",
    fontWeight: "500",
  },
  shareButton: {
    backgroundColor: "#4F46E5",
    marginHorizontal: 40,
    marginTop: 25,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  shareText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import OrganizerSidebar from '../components/OrganizerSidebar';

export default function OrganizerHome() {
  const router = useRouter();
  const slide = useRef(new Animated.Value(-300)).current;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const events = [
    {
      id: "1",
      title: "A virtual evening of smooth jazz",
      date: "1ST MAY • SAT • 2:00 PM",
      image: require("@/assets/ball.png"),
    },
    {
      id: "2",
      title: "Women's leadership conference",
      date: "1ST MAY • SAT • 2:00 PM",
      image: require("@/assets/gift.png"),
    },
  ];

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(slide, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slide, {
      toValue: -300,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };

  const renderEvent = ({ item }: { item: typeof events[0] }) => (
    <View style={styles.eventCard}>
      <Image source={item.image} style={styles.eventImage} resizeMode="cover" />
      <View style={styles.eventInfo}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push(`/organizer/edit/${item.id}` as any)}
          >
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.participantBtn}
            onPress={() => router.push(`/organizer/participants/${item.id}` as any)}
          >
            <Text style={styles.btnText}>Participants</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={openDrawer}>
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Organizer Home Screen</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Ionicons name="person-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Drawer */}
      {drawerOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeDrawer}
        />
      )}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slide }] }]}
        pointerEvents={drawerOpen ? "auto" : "none"}
      >
        <OrganizerSidebar onClose={closeDrawer} />
      </Animated.View>

      {/* Event List */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
      >
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f9fafb" },

  // Header
  topBar: {
    height: 56,
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  menuBtn: { padding: 6 },
  profileBtn: { padding: 6 },
  topTitle: { color: "#fff", fontWeight: "600" },

  // Overlay + Drawer
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 998,
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "#fff",
    zIndex: 999,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 8,
  },

  // Event Card
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  eventImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  eventInfo: { flex: 1 },
  dateText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  buttonRow: { flexDirection: "row", gap: 8 },
  editBtn: {
    backgroundColor: "#e0e7ff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  participantBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});

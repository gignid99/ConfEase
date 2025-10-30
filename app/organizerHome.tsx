import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import OrganizerSidebar from "../components/OrganizerSidebar";
import { db, auth } from "@/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function OrganizerHome() {
  const router = useRouter();
  const slide = useRef(new Animated.Value(-300)).current;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const user = auth.currentUser;

  const handleDelete = async (id: string) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "events", id));
            setEvents((prev) => prev.filter((e) => e.id !== id));
            Alert.alert("Deleted", "Event removed successfully.");
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

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

  const renderEvent = ({ item }: { item: any }) => {
    const isOwner = user && item.createdBy === user.uid;

    return (
      <View style={styles.eventCard}>
        <Image
          source={require("@/assets/ball.png")}
          style={styles.eventImage}
          resizeMode="cover"
        />
        <View style={styles.eventInfo}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={{ color: "#6b7280", marginBottom: 10 }}>
            {item.location}
          </Text>

          {isOwner ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => router.push(`/organizer/edit/${item.id}` as any)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.participantBtn}
                onPress={() =>
                  router.push(`/organizer/participants/${item.id}` as any)
                }
              >
                <Text style={styles.btnText}>Participants</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteBtn]}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ color: "#9ca3af", fontSize: 12 }}>
              (View Only — created by another organizer)
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.page}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={openDrawer}>
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Organizer Home</Text>
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
        {loading ? (
          <Text style={{ textAlign: "center", color: "#6b7280" }}>
            Loading events...
          </Text>
        ) : events.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#6b7280" }}>
            No events found.
          </Text>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderEvent}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f9fafb" },
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
  dateText: { fontSize: 12, color: "#6366f1", fontWeight: "600", marginBottom: 6 },
  eventTitle: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 10 },
  buttonRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  editBtn: {
    backgroundColor: "#3d0af6ff",
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
  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: 8,
    borderRadius: 20,
  },
  btnText: { color: "#f5dd0cff", fontSize: 13, fontWeight: "600" },
});

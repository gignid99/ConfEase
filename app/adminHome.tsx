import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AdminSidebar from "../components/adminSidebar";
import { Picker } from "@react-native-picker/picker";

interface EventItem {
  id: string;
  title: string;
  department?: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  imageUrl?: string;
}

export default function AdminHome() {
  const router = useRouter();
  const slide = useRef(new Animated.Value(-300)).current;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterType, setFilterType] = useState<"title" | "department" | "location">("title");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Fetch events from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "events"),
      (snapshot) => {
        const fetchedEvents: EventItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || "Untitled Event",
            department: data.department || "General",
            date: data.date || "",
            startTime: data.startTime || "",
            endTime: data.endTime || "",
            description: data.description || "",
            location: data.location || "",
            imageUrl: data.imageUrl || "",
          };
        });
        setEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // 🔹 Handle Filtering
useEffect(() => {
  if (!searchQuery.trim()) {
    setFilteredEvents(events);
  } else {
    const filtered = events.filter((e) => {
      const value =
        filterType === "title"
          ? e.title
          : filterType === "department"
          ? e.department
          : e.location;
      return (value ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredEvents(filtered);
  }
}, [searchQuery, filterType, events]);


  // 🔹 Delete event
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // 🔹 Drawer controls
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

  const renderEvent = ({ item }: { item: EventItem }) => (
    <View style={styles.eventCard}>
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require("@/assets/adm.png")
        }
        style={styles.eventImage}
      />

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.eventDetail}>
          🕒 {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.eventDetail}>🏛 {item.department}</Text>
        <Text style={styles.eventDetail}>📍 {item.location}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.participantBtn}
            onPress={() =>
              router.push(`/organizer/participants/${item.id}` as any)
            }
          >
            <Text style={styles.btnText}>Participants</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash" size={16} color="#fff" />
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={openDrawer}>
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Admin Home</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Ionicons name="person-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Sidebar Drawer */}
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
        <AdminSidebar onClose={closeDrawer} />
      </Animated.View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={filterType}
          style={styles.picker}
          onValueChange={(value) => setFilterType(value)}
        >
          <Picker.Item label="Filter by Title" value="title" />
          <Picker.Item label="Filter by Department" value="department" />
          <Picker.Item label="Filter by Location" value="location" />
        </Picker>

        <TextInput
          style={styles.searchInput}
          placeholder={`Search by ${filterType}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Events List */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading events...</Text>
        ) : filteredEvents.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No events found.</Text>
        ) : (
          <FlatList
            data={filteredEvents}
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
  topTitle: { color: "#fff", fontWeight: "600", fontSize: 16 },

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
  },

  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#eef2ff",
    justifyContent: "space-between",
  },
  picker: { flex: 0.5, backgroundColor: "#fff", borderRadius: 8 },
  searchInput: {
    flex: 0.5,
    marginLeft: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
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
  eventImage: { width: 70, height: 70, borderRadius: 12, marginRight: 12 },
  eventInfo: { flex: 1 },
  dateText: { fontSize: 12, color: "#6366f1", fontWeight: "600", marginBottom: 4 },
  eventTitle: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 6 },
  eventDetail: { fontSize: 13, color: "#4b5563", marginBottom: 3 },
  eventDescription: { fontSize: 12, color: "#6b7280", marginBottom: 10 },

  buttonRow: { flexDirection: "row", gap: 8 },
  participantBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});

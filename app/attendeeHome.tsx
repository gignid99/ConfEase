import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Animated,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import ParticipantSidebar from "../components/participantSidebar";
import { useTheme } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";

export default function AttendeeHome() {
  const { colors } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("title");

  const slide = useRef(new Animated.Value(-320)).current;
  const user = auth.currentUser;

  // Drawer animations
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
      toValue: -320,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };

  // 🔄 Realtime event updates
  useEffect(() => {
    const unsubscribeEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
      setFilteredEvents(data);
    });

    // Fetch user registrations once
    const fetchRegistrations = async () => {
      if (!user) return;
      const q = query(
        collection(db, "registrations"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      setRegistrations(snapshot.docs.map((d) => d.data().eventId));
    };

    fetchRegistrations();

    // cleanup listener
    return () => unsubscribeEvents();
  }, [user]);

  // 🔍 Filter logic
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

  // Toggle registration
  const toggleRegister = async (eventId: string) => {
    if (!user) {
      alert("Please log in to register.");
      return;
    }

    const isRegistered = registrations.includes(eventId);
    if (isRegistered) {
      // cancel registration
      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", eventId),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, "registrations", docSnap.id));
      });
      setRegistrations((prev) => prev.filter((id) => id !== eventId));
    } else {
      // add new registration
      await addDoc(collection(db, "registrations"), {
        eventId,
        userId: user.uid,
        status: "registered",
        timestamp: new Date(),
      });
      setRegistrations((prev) => [...prev, eventId]);
    }
  };

  // Render each event card
  const renderEvent = ({ item }: { item: any }) => {
    const isRegistered = registrations.includes(item.id);

    return (
      <View style={[styles.eventCard, { backgroundColor: colors.card }]}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color={colors.text} />
          </View>
        )}

        <View style={styles.eventInfo}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.eventDate, { color: colors.text }] }>
            {item.date} | {item.startTime?.split(" : ")[1]} -{" "}
            {item.endTime?.split(" : ")[1]}
          </Text>
          <Text style={[styles.eventLocation, { color: colors.text }]}>📍 {item.location}</Text>
          <Text style={[styles.eventDescription, { color: colors.text }]}>{item.description}</Text>

          <TouchableOpacity
            style={[
              styles.registerBtn,
              !isRegistered && { backgroundColor: colors.primary },
              isRegistered && { backgroundColor: "#ef4444" },
            ]}
            onPress={() => toggleRegister(item.id)}
          >
            <Text style={styles.registerText}>
              {isRegistered ? "CANCEL" : "REGISTER"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  return (
    <View style={styles.page}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuBtn}>
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Attendee Home</Text>
        <Link href="/ProfileScreen" asChild>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </Link>
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
        <ParticipantSidebar onClose={closeDrawer} />
      </Animated.View>

      {/* 🔍 Filter Section */}
      <View style={{ padding: 12, backgroundColor: "#eef2ff" }}>
        <TextInput
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            marginBottom: 8,
            height: 52,
          }}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Picker
          selectedValue={filterType}
          onValueChange={(v) => setFilterType(v)}
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            height: 52,
          }}
        >
          <Picker.Item label="Filter by Title" value="title" />
          <Picker.Item label="Filter by Department" value="department" />
          <Picker.Item label="Filter by Location" value="location" />
        </Picker>
      </View>

      {/* Event List */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {filteredEvents.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 40, color: "#6b7280" }}>
            No events available
          </Text>
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
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  eventImage: {
    width: "100%",
    height: 150,
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  eventInfo: { padding: 14 },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  eventDate: { fontSize: 13, color: "#6b7280", marginBottom: 4 },
  eventLocation: { fontSize: 13, color: "#4b5563", marginBottom: 6 },
  eventDescription: { fontSize: 13, color: "#374151", marginBottom: 10 },
  registerBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  registerText: { color: "#fff", fontWeight: "600", fontSize: 13 },
});

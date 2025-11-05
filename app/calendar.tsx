import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface EventType {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  imageUrl?: string;
}

export default function CalendarScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<EventType[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const snapshot = await getDocs(q);

        const eventsData: EventType[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            date: data.date || "",
            startTime: data.startTime || "",
            endTime: data.endTime || "",
            location: data.location || "",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
          };
        });

        setEvents(eventsData);

        const uniqueDays = Array.from(new Set(eventsData.map((e) => e.date)));
        setDays(uniqueDays);
        if (uniqueDays.length > 0) setSelectedDay(uniqueDays[0]);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Filter events by selected day
  const filteredEvents = selectedDay
    ? events.filter((e) => e.date === selectedDay)
    : events;

  return (
    <View
      style={[styles.container, Platform.OS === "web" && styles.webContainer]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>

      {/* Date Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daysContainer}
      >
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDay(day)}
            style={[
              styles.dayBox,
              selectedDay === day && styles.activeDay,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === day && styles.activeDayText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Events */}
      <ScrollView style={styles.eventList}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              {event.imageUrl ? (
                <Image
                  source={{ uri: event.imageUrl }}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color="#9ca3af" />
                </View>
              )}

              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>
                  {event.date} | {event.startTime} - {event.endTime}
                </Text>
                <Text style={styles.eventLocation}>
                  📍 {event.location}
                </Text>
                <Text style={styles.eventDescription}>
                  {event.description}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noEventText}>No events for this date</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fb" },
  webContainer: {
    maxWidth: 600,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginVertical: 20,
  },
  header: {
    backgroundColor: "#4f46e5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop:10,
    borderTopLeftRadius: Platform.OS === "web" ? 12 : 0,
    borderTopRightRadius: Platform.OS === "web" ? 12 : 0,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  daysContainer: {
    backgroundColor: "#f8f9fb",
    paddingVertical: 1,
    paddingHorizontal: 10,
    rowGap: 8,
  },
  dayBox: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    marginRight: 8,
    minWidth: 80,
    minHeight:50,
    maxHeight:50
  },
  activeDay: { backgroundColor: "#6366f1" },
  dayText: { color: "#374151", fontWeight: "600" },
  activeDayText: { color: "#fff" },
  eventList: { padding: 16 },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  eventImage: {
    width: "100%",
    height: 160,
  },
  imagePlaceholder: {
    width: "100%",
    height: 160,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  eventContent: {
    padding: 12,
  },
  eventTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  eventDate: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    marginBottom: 6,
  },
  eventLocation: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  noEventText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6b7280",
  },
});

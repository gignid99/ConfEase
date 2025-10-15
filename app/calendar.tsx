import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CalendarScreen() {
  const router = useRouter();

  const events = [
    { time: "08:00 am", title: "Tech Conference", color: "#c9e8e0" },
    { time: "09:45 am", title: "AI Conference", color: "#fce7e1" },
    { time: "10:50 am", title: "Online meeting", color: "#f9d4d4" },
    { time: "02:40 pm", title: "Workshop", color: "#ebd6f9" },
    { time: "04:00 pm", title: "Skype interview", color: "#cce4f9" },
    { time: "06:00 pm", title: "Team Sync", color: "#d0d5d9" },
  ];

  const days = ["Thu 26", "Fri 27", "Sat 28", "Sun 29", "Mon 30", "Tue 31", "Wed 01"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>

      {/* Days Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
        {days.map((day, index) => (
          <View key={index} style={[styles.dayBox, index === 0 && styles.activeDay]}>
            <Text style={[styles.dayText, index === 0 && styles.activeDayText]}>{day}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Events */}
      <ScrollView style={styles.eventList}>
        {events.map((event, index) => (
          <View key={index} style={styles.eventRow}>
            <Text style={styles.timeText}>{event.time}</Text>
            <View style={[styles.eventCard, { backgroundColor: event.color }]}>
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fb" },
  header: {
    backgroundColor: "#4f46e5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginLeft: 10 },
  daysContainer: {
    flexGrow: 0,
    backgroundColor: "#f8f9fb",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dayBox: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    marginRight: 8,
  },
  activeDay: { backgroundColor: "#6366f1" },
  dayText: { color: "#374151", fontWeight: "600" },
  activeDayText: { color: "#fff" },
  eventList: { padding: 16 },
  eventRow: { marginBottom: 20 },
  timeText: { color: "#6b7280", marginBottom: 6, fontWeight: "500" },
  eventCard: {
    borderRadius: 10,
    padding: 16,
    elevation: 1,
  },
  eventTitle: { fontSize: 16, fontWeight: "600", color: "#374151" },
});

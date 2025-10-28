import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Organizer {
  id: string;
  name: string;
  email: string;
  organization: string;
  status: string;
}

export default function OrganizerApprovalScreen() {
  // Mock organizer data
  const [organizers, setOrganizers] = useState<Organizer[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@techcon.com",
      organization: "TechCon 2025",
      status: "pending",
    },
    {
      id: "2",
      name: "Alice Smith",
      email: "alice@devsummit.com",
      organization: "DevSummit",
      status: "approved",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "mike@futureevent.com",
      organization: "Future Event",
      status: "pending",
    },
  ]);

  const handleApproval = (id: string, newStatus: "approved" | "rejected") => {
    setOrganizers((prev) =>
      prev.map((org) => (org.id === id ? { ...org, status: newStatus } : org))
    );
    Alert.alert("Status Updated", `Organizer ${newStatus}`);
  };

  const renderOrganizer = ({ item }: { item: Organizer }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.org}>{item.organization}</Text>
        <Text
          style={[
            styles.status,
            item.status === "approved"
              ? styles.approved
              : item.status === "rejected"
              ? styles.rejected
              : styles.pending,
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>

      {item.status === "pending" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#22c55e" }]}
            onPress={() => handleApproval(item.id, "approved")}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ef4444" }]}
            onPress={() => handleApproval(item.id, "rejected")}
          >
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organizer Approvals (Test Mode)</Text>

      <FlatList
        data={organizers}
        keyExtractor={(item) => item.id}
        renderItem={renderOrganizer}
        ListEmptyComponent={<Text style={styles.empty}>No organizers found</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  info: { marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "700", color: "#111827" },
  email: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  org: { fontSize: 14, color: "#4b5563", marginTop: 4 },
  status: { fontSize: 13, fontWeight: "600", marginTop: 6 },
  approved: { color: "#16a34a" },
  rejected: { color: "#dc2626" },
  pending: { color: "#ca8a04" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 20 },
});

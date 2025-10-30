import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Participants() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // eventId from previous page
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchParticipants = async () => {
      try {
        // Query registrations for this event
        const q = query(
          collection(db, "registrations"),
          where("eventId", "==", id)
        );
        const snapshot = await getDocs(q);
        const usersList: any[] = [];

        // For each registration, fetch user info from "users" collection
        for (const docSnap of snapshot.docs) {
          const { userId } = docSnap.data();
          const userDoc = await getDocs(
            query(collection(db, "users"), where("__name__", "==", userId))
          );
          userDoc.forEach((u) => {
            usersList.push({
              id: u.id,
              name: u.data().name,
              email: u.data().email,
            });
          });
        }

        setParticipants(usersList);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [id]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Participants</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Ionicons name="person-circle" size={36} color="#6366f1" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
               <Text style={styles.email}>{item.email}</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#6b7280" }}>
              No participants found.
            </Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    height: 56,
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#fff", fontWeight: "600", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    elevation: 1,
  },
  name: { fontWeight: "700", color: "#111827" },
  email: { color: "#6b7280", fontSize: 13 },
});

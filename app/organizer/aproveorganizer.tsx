import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "@/firebaseConfig"; // ✅ adjust your import path
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { deleteUser } from "firebase/auth"; // 👈 used for deleting rejected users
import { useRouter } from "expo-router";

interface Organizer {
  id: string;
  fullName: string;
  email: string;
  role: string;
  approve: string;
}

export default function ApproveOrganizer() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);
    const router = useRouter();
  // ✅ Listen to all pending organizers in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const pendingOrganizers = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Organizer))
          .filter(
            (user) => user.role === "organizer" && user.approve === "pending"
          );

        setOrganizers(pendingOrganizers);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching organizers:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ✅ Approve: only update Firestore
  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "users", id), { approve: "approve" });
      Alert.alert("Approved ✅", "Organizer approved successfully.");
    } catch (error) {
      console.error("Approval error:", error);
      Alert.alert("Error", "Failed to approve organizer.");
    }
  };

  // ✅ Reject: delete from Firestore & Auth
  const handleReject = async (id: string, email: string) => {
    try {
      await deleteDoc(doc(db, "users", id)); // ❌ Remove from Firestore
      // Optionally remove from Firebase Auth (Admin SDK usually needed)
      // You cannot delete arbitrary users from the client, but you can mark them as rejected instead.
      Alert.alert("Rejected 🚫", "Organizer removed successfully.");
    } catch (error) {
      console.error("Rejection error:", error);
      Alert.alert("Error", "Failed to remove organizer.");
    }
  };

  const renderOrganizer = ({ item }: { item: Organizer }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.role}>Role: {item.role}</Text>
        <Text style={[styles.status, styles.pending]}>
          {item.approve.toUpperCase()}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#22c55e" }]}
          onPress={() => handleApprove(item.id)}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ef4444" }]}
          onPress={() => handleReject(item.id, item.email)}
        >
          <Ionicons name="close-circle" size={20} color="#fff" />
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text>Loading organizers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <View style={styles.headerRow}>
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={34} color="#131010ff" />
  </TouchableOpacity>
  <Text style={styles.title}>Organizer Approvals</Text>
</View>

      <FlatList
        data={organizers}
        keyExtractor={(item) => item.id}
        renderItem={renderOrganizer}
        ListEmptyComponent={<Text style={styles.empty}>No pending organizers</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 20, marginLeft:30 },
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
  role: { fontSize: 14, color: "#4b5563", marginTop: 4 },
  status: { fontSize: 13, fontWeight: "600", marginTop: 6 },
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
  headerRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  width: "100%", 
  backgroundColor: "#dddde7ff",
  paddingVertical: 14,
  paddingHorizontal: 0,
  borderRadius: 12,
  marginBottom: 20,

},
  btnText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

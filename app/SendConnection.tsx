import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import HeaderBar from "@/components/HeaderBar";
import { useRouter } from "expo-router";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "@/firebaseConfig";

type UserItem = {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
};

export default function SendConnection() {
  const router = useRouter();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const currentUser = auth.currentUser;

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [requestsMap, setRequestsMap] = useState<Record<string, any>>({});
  const [connectionsMap, setConnectionsMap] = useState<Record<string, boolean>>({});

  // 🔹 Fetch only attendees (exclude current user)
  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);

    const attendeesQuery = query(
      collection(db, "users"),
      where("role", "==", "attendee")
    );

    const unsubUsers = onSnapshot(attendeesQuery, (snap) => {
      const list: UserItem[] = [];
      snap.forEach((d) => {
        if (d.id === currentUser.uid) return; // exclude logged-in user
        const data = d.data() as any;
        list.push({
          uid: d.id,
          displayName: data.fullName || data.displayName || "Unnamed User",
          email: data.email,
          photoURL: data.photoURL || "",
        });
      });
      setUsers(list);
      setLoading(false);
    });

    // 🔹 Listen for requests (sent or received)
    const unsubRequests = onSnapshot(collection(db, "requests"), (snap) => {
      const map: Record<string, any> = {};
      snap.forEach((d) => {
        const data = d.data() as any;
        map[d.id] = data;
      });
      setRequestsMap(map);
    });

    // 🔹 Listen for active connections
    const unsubConnections = onSnapshot(collection(db, "connections"), (snap) => {
      const cmap: Record<string, boolean> = {};
      snap.forEach((d) => {
        const data = d.data() as any;
        cmap[`${data.user1}_${data.user2}`] = true;
        cmap[`${data.user2}_${data.user1}`] = true;
      });
      setConnectionsMap(cmap);
    });

    return () => {
      unsubUsers();
      unsubRequests();
      unsubConnections();
    };
  }, [currentUser?.uid]);

  // 🔹 Send new request
  const sendConnectionRequest = async (targetUserId: string) => {
    if (!currentUser) return Alert.alert("Login required");
    const senderId = currentUser.uid;
    const receiverId = targetUserId;
    const docId = `${senderId}_${receiverId}`;

    try {
      setSendingId(targetUserId);
      const ref = doc(db, "requests", docId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          senderId,
          receiverId,
          status: "pending",
          createdAt: serverTimestamp(),
        });
        Alert.alert("✅ Request Sent!");
      } else {
        Alert.alert("ℹ️ You’ve already sent a request to this user.");
      }
    } catch (e) {
      console.error("Error sending request:", e);
    } finally {
      setSendingId(null);
    }
  };

  // 🔹 Cancel/Revert a sent request
  const cancelRequest = async (targetUserId: string) => {
    if (!currentUser) return;
    const senderId = currentUser.uid;
    const receiverId = targetUserId;
    const docId = `${senderId}_${receiverId}`;

    try {
      await deleteDoc(doc(db, "requests", docId));
      Alert.alert("⏪ Request Reverted");
    } catch (e) {
      console.error("Error canceling request:", e);
    }
  };

  // 🔹 Determine current relationship state for button
  const getStatusFor = (targetUid: string) => {
    if (!currentUser) return { label: "Sign in", action: null, disabled: true };
    const me = currentUser.uid;

    // Already connected
    if (connectionsMap[`${me}_${targetUid}`]) {
      return { label: "Connected", action: null, disabled: true };
    }

    // Outgoing or incoming request
    const outgoingId = `${me}_${targetUid}`;
    const incomingId = `${targetUid}_${me}`;
    const outgoing = requestsMap[outgoingId];
    const incoming = requestsMap[incomingId];

    if (outgoing && outgoing.status === "pending")
      return { label: "Revert Request", action: () => cancelRequest(targetUid), disabled: false };

    if (incoming && incoming.status === "pending")
      return { label: "Incoming Request", action: null, disabled: true };

    return { label: "Send Request", action: () => sendConnectionRequest(targetUid), disabled: false };
  };

  // 🔹 Render each attendee card
  const renderUser = ({ item }: { item: UserItem }) => {
    const { label, action, disabled } = getStatusFor(item.uid);
    const isSending = sendingId === item.uid;

    return (
      <View style={styles.card}>
        <View style={styles.left}>
          <Image
            source={
              item.photoURL
                ? { uri: item.photoURL }
                : require("../assets/images/favicon.png")
            }
            style={styles.avatar}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>{item.displayName}</Text>
            {item.email && <Text style={styles.email}>{item.email}</Text>}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            disabled && { backgroundColor: "#bbb" },
          ]}
          onPress={action}
          disabled={!action || isSending}
        >
          {isSending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>{label}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderBar title="Send Connection" />
        <ActivityIndicator size="large" style={{ marginTop: 40 }} color="#3F51B5" />
      </View>
    );
  }

  // 🔹 Main render
  return (
    <View style={styles.container}>
      <HeaderBar title="Send Connection" />
      {users.length === 0 ? (
        <Text style={styles.noText}>No attendees found.</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(u) => u.uid}
          contentContainerStyle={{ padding: 12 }}
        />
      )}

      {/* Buttons for navigation */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/ConnectionRequests")}
      >
        <Text style={styles.secondaryButtonText}>View Connection Requests</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 4 }]}
        onPress={() => router.push("/ConnectionList")}
      >
        <Text style={styles.secondaryButtonText}>View My Connections</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEF0FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  left: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  name: { fontSize: 16, fontWeight: "600", color: "#000" },
  email: { color: "#555", fontSize: 13 },
  primaryButton: {
    backgroundColor: "#3F51B5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  secondaryButton: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    margin: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: { fontWeight: "600", color: "#000" },
  noText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 15,
    color: "#777",
  },
});

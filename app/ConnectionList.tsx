import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import HeaderBar from "@/components/HeaderBar";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "@/firebaseConfig";
import { useRouter } from "expo-router";

type Connection = {
  id: string;
  friendId: string;
  friendName?: string;
  friendEmail?: string;
  friendPhoto?: string;
};

export default function ConnectionsList() {
  const db = getFirestore(app);
  const auth = getAuth(app);
  const router = useRouter();
  const currentUser = auth.currentUser;

  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all connections for current user
  useEffect(() => {
    if (!currentUser) return;

    const fetchConnections = async () => {
      try {
        setLoading(true);

        // connections where current user is user1 or user2
        const q1 = query(collection(db, "connections"), where("user1", "==", currentUser.uid));
        const q2 = query(collection(db, "connections"), where("user2", "==", currentUser.uid));

        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        const allConnections = [...snap1.docs, ...snap2.docs];

        const connectionData: Connection[] = [];

        for (const docSnap of allConnections) {
          const data = docSnap.data() as any;
          const friendId = data.user1 === currentUser.uid ? data.user2 : data.user1;

          // fetch friend info from users collection
          const friendRef = doc(db, "users", friendId);
          const friendSnap = await getDoc(friendRef);
          const friendData = friendSnap.exists() ? friendSnap.data() : {};

          connectionData.push({
            id: docSnap.id,
            friendId,
            friendName: friendData.fullName || friendData.displayName || "Unnamed User",
            friendEmail: friendData.email || "",
            friendPhoto: friendData.photoURL || "",
          });
        }

        setConnections(connectionData);
      } catch (error) {
        console.error("Error loading connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [currentUser]);

  const renderConnection = ({ item }: { item: Connection }) => (
    <View style={styles.card}>
      <View style={styles.left}>
        <Image
          source={
            item.friendPhoto
              ? { uri: item.friendPhoto }
              : require("../assets/images/favicon.png")
          }
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>{item.friendName}</Text>
          {item.friendEmail && <Text style={styles.email}>{item.friendEmail}</Text>}
        </View>
      </View>
    </View>
  );

  if (loading)
    return (
      <View style={styles.container}>
        <HeaderBar title="My Connections" />
        <ActivityIndicator size="large" color="#3F51B5" style={{ marginTop: 40 }} />
      </View>
    );

  return (
    <View style={styles.container}>
      <HeaderBar title="My Connections" />

      {connections.length === 0 ? (
        <Text style={styles.noText}>You have no connections yet.</Text>
      ) : (
        <FlatList
          data={connections}
          renderItem={renderConnection}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12 }}
        />
      )}

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/SendConnection")}
      >
        <Text style={styles.secondaryButtonText}>Back to Attendees</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF0FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  left: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600", color: "#000" },
  email: { color: "#555", fontSize: 13 },
  noText: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    margin: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: { fontWeight: "600", color: "#000" },
});

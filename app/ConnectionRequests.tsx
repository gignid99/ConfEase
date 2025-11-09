import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import HeaderBar from "@/components/HeaderBar";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "@/firebaseConfig";

export default function ConnectionRequests() {
  const db = getFirestore(app);
  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSenderInfo = async (id: string) => {
    try {
      const ref = doc(db, "users", id);
      const snap = await getDoc(ref);
      if (snap.exists()) return snap.data();
    } catch (e) {
      console.error(e);
    }
    return {};
  };

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "requests"),
      where("receiverId", "==", currentUser.uid),
      where("status", "==", "pending")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const data = await Promise.all(
        snap.docs.map(async (d) => {
          const req = d.data();
          const sender = await fetchSenderInfo(req.senderId);
          return {
            id: d.id,
            ...req,
            senderName: sender.displayName || sender.name || req.senderId,
            senderPhoto: sender.photoURL || null,
            senderEmail: sender.email || "",
          };
        })
      );
      setRequests(data);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  const handleAccept = async (item: any) => {
    try {
      await updateDoc(doc(db, "requests", item.id), { status: "accepted" });
      await setDoc(doc(db, "connections", item.id), {
        user1: item.senderId,
        user2: item.receiverId,
        createdAt: serverTimestamp(),
      });
      Alert.alert("Connected!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (item: any) => {
    try {
      await deleteDoc(doc(db, "requests", item.id));
      Alert.alert("Request rejected");
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.left}>
        <Image
          source={
            item.senderPhoto
              ? { uri: item.senderPhoto }
              : require("../assets/images/favicon.png")
          }
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>{item.senderName}</Text>
          {item.senderEmail && <Text style={styles.email}>{item.senderEmail}</Text>}
        </View>
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.accept} onPress={() => handleAccept(item)}>
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reject} onPress={() => handleReject(item)}>
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading)
    return (
      <View style={styles.container}>
        <HeaderBar title="Connection Requests" />
        <ActivityIndicator style={{ marginTop: 30 }} />
      </View>
    );

  return (
    <View style={styles.container}>
      <HeaderBar title="Connection Requests" />
      {requests.length === 0 ? (
        <Text style={styles.noText}>No incoming requests</Text>
      ) : (
        <FlatList data={requests} renderItem={renderItem} keyExtractor={(i) => i.id} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  card: {
    backgroundColor: "#F4F6FF",
    borderRadius: 10,
    padding: 14,
    marginVertical: 8,
  },
  left: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  email: { color: "#666", fontSize: 13 },
  btnRow: { flexDirection: "row", marginTop: 10, justifyContent: "space-between" },
  accept: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 8, flex: 1, marginRight: 5 },
  reject: { backgroundColor: "#F44336", padding: 10, borderRadius: 8, flex: 1, marginLeft: 5 },
  btnText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  noText: { textAlign: "center", marginTop: 40, color: "#777" },
});

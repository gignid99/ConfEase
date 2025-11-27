import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        const ref = doc(db, 'events', String(id));
        const snap = await getDoc(ref);
        if (snap.exists()) setEvent({ id: snap.id, ...snap.data() });

        // check registration
        const user = auth.currentUser;
        if (user) {
          const q = query(
            collection(db, 'registrations'),
            where('eventId', '==', String(id)),
            where('userId', '==', user.uid)
          );
          const s = await getDocs(q);
          setRegistered(!s.empty);
        }
      } catch (e) {
        console.error('Failed to load event', e);
        Alert.alert('Error', 'Unable to load event');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleRegister = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to register for events');
      router.push('/signin');
      return;
    }

    try {
      if (registered) {
        const q = query(
          collection(db, 'registrations'),
          where('eventId', '==', String(id)),
          where('userId', '==', user.uid)
        );
        const s = await getDocs(q);
        for (const docSnap of s.docs) {
          await deleteDoc(doc(db, 'registrations', docSnap.id));
        }
        setRegistered(false);
      } else {
        await addDoc(collection(db, 'registrations'), {
          eventId: String(id),
          userId: user.uid,
          status: 'registered',
          timestamp: new Date(),
        });
        setRegistered(true);
      }
    } catch (e) {
      console.error('Register failed', e);
      Alert.alert('Error', 'Unable to update registration');
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}> 
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}> 
        <Text style={{ color: colors.text }}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: 16 }}>
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.card }]}>
          <Ionicons name="image-outline" size={48} color={colors.text} />
        </View>
      )}

      <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>
      <Text style={[styles.meta, { color: colors.text }]}>{event.date} • {event.startTime} - {event.endTime}</Text>
      <Text style={[styles.meta, { color: colors.text }]}>📍 {event.location}</Text>

      <View style={{ height: 12 }} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
      <Text style={[styles.description, { color: colors.text }]}>{event.description}</Text>

      <View style={{ height: 18 }} />
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: registered ? '#ef4444' : colors.primary }]} onPress={toggleRegister}>
        <Text style={styles.actionText}>{registered ? 'Cancel Registration' : 'Register'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 220, borderRadius: 12, marginBottom: 12 },
  imagePlaceholder: { width: '100%', height: 220, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginTop: 6 },
  meta: { marginTop: 6, color: '#666' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  description: { marginTop: 6, lineHeight: 20 },
  actionBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  actionText: { color: '#fff', fontWeight: '700' },
});

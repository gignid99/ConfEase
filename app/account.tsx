import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const faqs = [
  {
    q: 'How do I register for an event?',
    a: 'Open the event detail page and tap "Register". You must be signed in to register.'
  },
  {
    q: 'How can I edit my profile?',
    a: 'Go to My Profile from the sidebar and tap "Edit Profile".'
  },
  {
    q: 'How do I cancel a registration?',
    a: 'Open the event page you registered for and tap "Cancel Registration".'
  },
  {
    q: 'Who can I contact for support?',
    a: 'Use the contact link below to email the organizers.'
  }
];

export default function AccountPage() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { backgroundColor: '#4F46E5' }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.back}> 
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.title, { color: '#fff' }]}>Help & FAQs</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}> 
        {faqs.map((f, i) => (
          <View key={i} style={[styles.faqItem, { borderColor: colors.border }]}> 
            <Text style={[styles.question, { color: colors.text }]}>{f.q}</Text>
            <Text style={[styles.answer, { color: colors.text }]}>{f.a}</Text>
          </View>
        ))}

        <View style={{ height: 12 }} />
        <TouchableOpacity
          onPress={() => Linking.openURL('mailto:support@confease.example')}
          style={[styles.contactBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.contactText, { color: colors.background }]}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  header: { height: 56, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  back: { position: 'absolute', left: 12, top: 12, padding: 6 },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  faqItem: { borderBottomWidth: 1, paddingVertical: 12 },
  question: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  answer: { fontSize: 14, lineHeight: 20 },
  contactBtn: { paddingVertical: 12, alignItems: 'center', borderRadius: 8, marginTop: 8 },
  contactText: { fontWeight: '700' },
});

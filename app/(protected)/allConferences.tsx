import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// We'll combine both featured and list events for the full list
const allConferences = [
  {
    id: 'f1',
    title: 'TechCon',
    dateDay: '10',
    dateMonth: 'JUNE',
    time: '2:00 PM - 5:00 PM',
    location: 'Convention Center, Hall A',
    image: null,
  },
  {
    id: 'f2',
    title: 'TechAi',
    dateDay: '10',
    dateMonth: 'JUNE',
    time: '1:00 PM - 4:00 PM',
    location: 'Innovation Hub',
    image: null,
  },
  {
    id: 'e1',
    title: "Women's leadership conference",
    dateDay: '1',
    dateMonth: 'MAY',
    time: '2:00 PM - 6:00 PM',
    location: 'Grand Hotel',
    image: null,
  },
  {
    id: 'e2',
    title: "Developer Summit 2025",
    dateDay: '15',
    dateMonth: 'MAY',
    time: '9:00 AM - 5:00 PM',
    location: 'Tech Campus',
    image: null,
  },
  {
    id: 'e3',
    title: "AI & ML Conference",
    dateDay: '22',
    dateMonth: 'MAY',
    time: '10:00 AM - 4:00 PM',
    location: 'Research Center',
    image: null,
  }
];

export default function AllConferences() {
  const [selectedConference, setSelectedConference] = useState<typeof allConferences[0] | null>(null);

  const renderConference = ({ item }: { item: typeof allConferences[0] }) => (
    <TouchableOpacity
      style={styles.conferenceCard}
      onPress={() => setSelectedConference(item)}
    >
      <View style={styles.cardTop}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{item.dateDay}</Text>
          <Text style={styles.dateMonth}>{item.dateMonth}</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookmark}
          onPress={(e) => {
            e.stopPropagation();
            // Add bookmark logic here
          }}
        >
          <Ionicons name="bookmark-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>
        <TouchableOpacity 
          style={styles.registerBtn}
          onPress={(e) => {
            e.stopPropagation();
            router.push('/Register');
          }}
        >
          <Text style={styles.registerText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Conferences</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <View style={styles.scrollContainer}>
        {/* Conferences List */}
        <FlatList
          data={allConferences}
          renderItem={renderConference}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>

      {/* Conference Details Modal */}
      {selectedConference && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setSelectedConference(null)} 
                style={styles.modalClose}
              >
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Conference Details</Text>
              <TouchableOpacity style={styles.modalShare}>
                <Ionicons name="share-outline" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* Date Badge */}
              <View style={[styles.dateBadge, { alignSelf: 'flex-start', marginBottom: 16 }]}>
                <Text style={styles.dateDay}>{selectedConference.dateDay}</Text>
                <Text style={styles.dateMonth}>{selectedConference.dateMonth}</Text>
              </View>

              {/* Conference Title */}
              <Text style={styles.modalConfTitle}>{selectedConference.title}</Text>

              {/* Time & Location */}
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color="#6b7280" />
                <Text style={styles.infoText}>{selectedConference.time}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#6b7280" />
                <Text style={styles.infoText}>{selectedConference.location}</Text>
              </View>

              {/* Description */}
              <Text style={styles.sectionTitle}>About Event</Text>
              <Text style={styles.description}>
                Join us for this exciting conference that brings together industry leaders and innovators.
                This event features keynote speakers, interactive workshops, and networking opportunities.
              </Text>

              {/* Speakers */}
              <Text style={styles.sectionTitle}>Speakers</Text>
              <View style={styles.speakersGrid}>
                {['John Doe', 'Jane Smith', 'Bob Wilson'].map((speaker, index) => (
                  <View key={index} style={styles.speakerCard}>
                    <View style={styles.speakerAvatar} />
                    <Text style={styles.speakerName}>{speaker}</Text>
                    <Text style={styles.speakerRole}>Speaker</Text>
                  </View>
                ))}
              </View>

              {/* Register Button */}
              <TouchableOpacity 
                style={styles.registerButton}
                onPress={() => {
                  setSelectedConference(null);
                  router.push('/Register');
                }}
              >
                <Text style={styles.registerText}>REGISTER NOW</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    height: 56,
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  rightPlaceholder: {
    width: 40,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  conferenceCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  cardBody: {
    padding: 12,
    paddingTop: 0,
  },
  dateBadge: {
    backgroundColor: '#fee2e2',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateDay: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ef4444',
  },
  dateMonth: {
    fontSize: 10,
    color: '#ef4444',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  bookmark: {
    padding: 4,
  },
  modalOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalClose: {
    padding: 8,
  },
  modalShare: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalScroll: {
    padding: 16,
  },
  modalConfTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  description: {
    color: '#4b5563',
    lineHeight: 22,
  },
  speakersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginTop: 8,
  },
  speakerCard: {
    width: '33.333%',
    padding: 8,
    alignItems: 'center',
  },
  speakerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e5e7eb',
    marginBottom: 8,
  },
  speakerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  speakerRole: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  registerBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
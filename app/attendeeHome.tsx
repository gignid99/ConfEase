import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image, useWindowDimensions, Platform, Animated } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ParticipantSidebar from '../components/participantSidebar';

const featured = [
  {
    id: 'f1',
    title: 'TechCon',
    dateDay: '10',
    dateMonth: 'JUNE',
    image: null,
  },
  {
    id: 'f2',
    title: 'TechAi',
    dateDay: '10',
    dateMonth: 'JUNE',
    image: null,
  },
];

const listEvents = [
  { id: 'e1', title: "Women's leadership conference", date: '1st May • Sat • 2:00 PM' },
  { id: 'e2', title: "Women's leadership conference", date: '1st May • Sat • 2:00 PM' },
];

export default function AttendeeHome() {
  const { width } = useWindowDimensions();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedConference, setSelectedConference] = useState<(typeof featured[0] & { visible: boolean }) | null>(null);
  const slide = useRef(new Animated.Value(-320)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(slide, { toValue: 0, duration: 280, useNativeDriver: true }).start();
  };
  const closeDrawer = () => {
    Animated.timing(slide, { toValue: -320, duration: 240, useNativeDriver: true }).start(() => setDrawerOpen(false));
  };

  const showConferenceDetails = (conference: typeof featured[0]) => {
    setSelectedConference({ ...conference, visible: true });
  };

  const hideConferenceDetails = () => {
    setSelectedConference(null);
  };
  const renderFeatured = ({ item }: { item: typeof featured[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => showConferenceDetails(item)}
    >
      <View style={styles.cardTop}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{item.dateDay}</Text>
          <Text style={styles.dateMonth}>{item.dateMonth}</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookmark}
          onPress={(e) => {
            e.stopPropagation(); // Prevent card navigation when bookmarking
            // Add bookmark logic here
          }}
        >
          <Ionicons name="bookmark-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <TouchableOpacity 
          style={styles.registerBtn}
          onPress={(e) => {
            e.stopPropagation(); // Prevent card navigation when registering
            router.push('/Register');
          }}
        >
          <Text style={styles.registerText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderList = ({ item }: { item: typeof listEvents[0] }) => (
    <TouchableOpacity
      style={styles.listRow}
      onPress={() => showConferenceDetails({
        id: item.id,
        title: item.title,
        dateDay: item.date.split('•')[0].trim().split(' ')[0], // "1st" from "1st May • Sat • 2:00 PM"
        dateMonth: item.date.split('•')[0].trim().split(' ')[1].toUpperCase(), // "MAY" from "1st May • Sat • 2:00 PM"
        image: null
      })}
    >
      <View style={styles.thumb} />
      <View style={styles.listBody}>
        <Text style={styles.listTitle}>{item.title}</Text>
        <Text style={styles.listDate}>{item.date}</Text>
      </View>
      <TouchableOpacity 
        style={styles.rowBookmark}
        onPress={(e) => {
          e.stopPropagation(); // Prevent opening details when bookmarking
          // Add bookmark logic here
        }}
      >
        <Ionicons name="bookmark-outline" size={18} color="#ef4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.page}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={openDrawer}>
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Attendee Home</Text>
        <Link href="/share-profile" asChild>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Drawer and overlay */}
      {drawerOpen && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDrawer} />
      )}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slide }] }]} pointerEvents={drawerOpen ? 'auto' : 'none'}>
        <ParticipantSidebar onClose={closeDrawer} />
      </Animated.View>

      {/* Conference Details Modal */}
      {selectedConference && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={hideConferenceDetails} style={styles.modalClose}>
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
                <Text style={styles.infoText}>2:00 PM - 5:00 PM</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#6b7280" />
                <Text style={styles.infoText}>Convention Center, Hall A</Text>
              </View>

              {/* About */}
              <Text style={styles.sectionTitle}>About Event</Text>
              <Text style={styles.description}>
                Join us for an exciting conference that brings together industry leaders and innovators.
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
                style={styles.modalRegisterBtn}
                onPress={() => {
                  hideConferenceDetails();
                  router.push('/Register');
                }}
              >
                <Text style={styles.registerText}>REGISTER NOW</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.upcomingTitle}>Upcoming Events</Text>
          <Link href="/calendar" style={styles.seeAll}>See All ▸</Link>
        </View>

        <FlatList
          data={featured}
          keyExtractor={(i) => i.id}
          renderItem={renderFeatured}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          contentContainerStyle={styles.featuredList}
        />

        <View style={styles.listContainer}>
          <FlatList
            data={listEvents}
            keyExtractor={(i) => i.id}
            renderItem={renderList}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f3f4f6' },
  modalOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#6b7280',
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
  modalRegisterBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  overlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 998 },
  drawer: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 320, backgroundColor: '#fff', zIndex: 999, elevation: 8, shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: { width: 2, height: 0 }, shadowRadius: 8 },
  topBar: { height: 56, backgroundColor: '#6366f1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  menuBtn: { padding: 6 },
  profileBtn: { padding: 6 },
  topTitle: { color: '#fff', fontWeight: '600' },
  scrollView: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  featuredList: { paddingHorizontal: 16, paddingVertical: 8 },
  listContainer: { paddingHorizontal: 16, paddingTop: 12 },
  logoContainer: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 8,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22d3ee',
    borderWidth: 3,
    borderColor: '#fff',
  },
  brandName: { fontSize: 22, fontWeight: '600', color: '#111827', marginBottom: 6 },
  container: { paddingTop: 0, paddingHorizontal: 0, alignItems: 'center' },
  cardShell: { width: '100%', alignItems: 'center', paddingHorizontal: 0 },
  cardInner: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 20, padding: 20, marginTop: 8, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  upcomingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  upcomingHeaderCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  upcomingTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  seeAll: { color: '#6b7280' },
  card: { width: 280, backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateBadge: { backgroundColor: '#fee2e2', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8 },
  dateDay: { fontSize: 18, fontWeight: '700', color: '#ef4444' },
  dateMonth: { fontSize: 10, color: '#ef4444' },
  bookmark: { padding: 6 },
  cardBody: { marginTop: 12, alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  registerBtn: { backgroundColor: '#6366f1', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 24 },
  registerText: { color: '#fff', fontWeight: '700' },
  listRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12 },
  thumb: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#c7d2fe', marginRight: 12 },
  listBody: { flex: 1 },
  listTitle: { fontWeight: '700', color: '#111827' },
  listDate: { color: '#6b7280', marginTop: 4, fontSize: 12 },
  rowBookmark: { padding: 6 },
});

import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
const menuItems = [
  { label: 'My Profile', icon: 'account', route: '/ProfileScreen' },
  { label: 'Calendar', icon: 'calendar', route: '/calendar' },
  { label: 'Share Profile', icon: 'share-variant', route: '/share-profile' },
  { label: 'Nearby Connection', icon: 'account-multiple', route: '/SendConnection' },
  { label: 'Certificates', icon: 'certificate', route: '/account' },
  { label: 'Settings', icon: 'cog', route: '/account' },
  { label: 'Help & FAQs', icon: 'help-circle', route: '/account' },
  { label: 'Sign Out', icon: 'logout', route: '/signin' },
];

export default function ParticipantSidebar({ onClose }) {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const handleMenuItemPress = (item) => {
    if (item.route) {
      if (item.route === '/signin') {
        router.replace(item.route);
      } else {
        router.push(item.route);
      }
    }
    if (onClose) onClose();
  };

  // 🧩 Fetch user name from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setUserName('Guest');
          setLoading(false);
          return;
        }

        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserName(docSnap.data().fullName || 'User');
        } else {
          setUserName(currentUser.displayName || 'User');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName('User');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Close / Cross button (top-right) */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          router.push('/attendeeHome');
          if (onClose) onClose();
        }}
      >
        <Icon name="close" size={22} color="#444" />
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://example.com/profile-placeholder.png' }}
          style={styles.profileImage}
        />

        {loading ? (
          <ActivityIndicator size="small" color="#6366f1" />
        ) : (
          <Text style={styles.profileName}>{userName}</Text>
        )}
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item)}
            activeOpacity={0.6}
          >
            <Icon name={item.icon} size={20} color="#888" style={styles.icon} />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 10,
    padding: 8,
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  icon: {
    marginRight: 16,
    width: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
});

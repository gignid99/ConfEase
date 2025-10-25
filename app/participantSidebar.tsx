// Sidebar.js
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const menuItems = [
  { label: 'My Profile', icon: 'account' },
  { label: 'Calendar', icon: 'calendar' },
  { label: 'Share Profile', icon: 'share-variant' },
  { label: 'Nearby Connection', icon: 'account-multiple' },
  { label: 'Certificates', icon: 'certificate' },
  { label: 'Settings', icon: 'cog' },
  { label: 'Help & FAQs', icon: 'help-circle' },
  { label: 'Sign Out', icon: 'logout' },
];

export default function Sidebar() {
  const handleMenuItemPress = (label: string) => {
    console.log(`${label} pressed`);
    // Add navigation or action handling here
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require('./confx-logo.png')} // Replace with your actual profile image
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Surya Singh Tomar</Text>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item.label)}
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
  profileSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 24,
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
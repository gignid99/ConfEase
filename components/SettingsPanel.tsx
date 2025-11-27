import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { setPreferredColorScheme } from '../hooks/use-color-scheme';
import { useTheme } from '@react-navigation/native';

export default function SettingsPanel() {
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const n = await AsyncStorage.getItem('settings.notifications');
        const d = await AsyncStorage.getItem('settings.darkMode');
        setNotificationsEnabled(n === '1');
        setDarkModeEnabled(d === '1');
      } catch (e) {
        console.log('Failed to load settings', e);
      }
    };
    load();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      await AsyncStorage.setItem('settings.notifications', value ? '1' : '0');
    } catch (e) {
      console.log('Failed to save notifications setting', e);
    }
  };

  const toggleDarkMode = async (value: boolean) => {
    setDarkModeEnabled(value);
    try {
      await AsyncStorage.setItem('settings.darkMode', value ? '1' : '0');
      // apply immediately across the app
      console.log('[SettingsPanel] toggling dark mode ->', value);
      await setPreferredColorScheme(value ? 'dark' : 'light');
    } catch (e) {
      console.log('Failed to save darkMode setting', e);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // clear stored name
      await AsyncStorage.removeItem('fullName');
      router.replace('/signin');
    } catch (e) {
      console.log('Logout failed', e);
      Alert.alert('Logout failed', String(e));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Settings</Text>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Enable notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#767577', true: colors.primary }}
        />
      </View>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Dark mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: colors.primary }}
        />
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16, color: '#111' },
  section: { marginTop: 24 },
  logoutBtn: { backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '700' },
});

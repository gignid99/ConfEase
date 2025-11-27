import React from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsPanel from '../components/SettingsPanel';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Link href=".." asChild>
          <Ionicons name="chevron-back" size={28} color="#fff" style={styles.backIcon} />
        </Link>
      </View>
      <SettingsPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, backgroundColor: '#6366f1', alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 12 },
  backIcon: { padding: 6 },
});

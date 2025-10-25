// components/HeaderBar.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface HeaderBarProps {
  title: string;
  backgroundColor?: string;
  textColor?: string;
  showBack?: boolean;
}

export default function HeaderBar({
  title,
  backgroundColor = "#3F51B5",
  textColor = "#fff",
  showBack = true,
}: HeaderBarProps) {
  const router = useRouter();

  return (
    <View style={[styles.header, { backgroundColor }]}>
      {showBack && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  backButton: { marginRight: 10 },
  title: { fontSize: 18, fontWeight: "600" },
});

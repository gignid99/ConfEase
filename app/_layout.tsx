import { Stack } from "expo-router";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from 'react';
import { View, Platform, StatusBar as RNStatusBar, StyleSheet } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
        {/* Auth screens */}
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />

        {/* events */}
        <Stack.Screen name="calendar" />
        <Stack.Screen name="create-event" />
         <Stack.Screen name="share-profile" />
         <Stack.Screen name="SendConnection"/>
         <Stack.Screen name="ConnectionRequests"/>
         <Stack.Screen name="ProfileScreen"/>
        {/* Main app (tab layout) */}
        {/* <Stack.Screen name="(tabs)" /> */}
        </Stack>
      </View>

      <ExpoStatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) : 0,
  },
});

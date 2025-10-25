import { Stack } from "expo-router";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth screens */}
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />

        {/* events */}
        <Stack.Screen name="calendar" />
        <Stack.Screen name="create-event" />
         <Stack.Screen name="share-profile" />
        {/* Main app (tab layout) */}
        {/* <Stack.Screen name="(tabs)" /> */}
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

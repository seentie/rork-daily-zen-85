import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ZenProvider } from "@/hooks/zen-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContent: {
    backgroundColor: '#0a0a0a',
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      animation: 'fade',
      contentStyle: styles.stackContent
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="breathe" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <ZenProvider>
          <RootLayoutNav />
        </ZenProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
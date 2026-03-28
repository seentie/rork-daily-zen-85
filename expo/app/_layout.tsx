import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, Platform, ErrorUtils } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ZenProvider } from "@/hooks/zen-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: Platform.OS === 'android' ? 1 : 3,
      staleTime: 5000,
    },
  },
});

if (Platform.OS === 'android' && ErrorUtils) {
  const originalErrorHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.log('[RootLayout] Global error caught:', error);
    console.log('[RootLayout] Is fatal:', isFatal);
    if (originalErrorHandler) {
      originalErrorHandler(error, isFatal);
    }
  });
}

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
    console.log('[RootLayout] App started on platform:', Platform.OS);
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
        console.log('[RootLayout] Splash screen hidden');
      } catch (error) {
        console.log('[RootLayout] Error hiding splash:', error);
      }
    };
    
    const timer = setTimeout(hideSplash, 100);
    return () => clearTimeout(timer);
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
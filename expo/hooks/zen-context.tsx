import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface ZenState {
  selectedIntention: string | null;
  setSelectedIntention: (intention: string | null) => void;
  lastIntentionDate: string | null;
}

const STORAGE_KEY = 'zen-app-state';

export const [ZenProvider, useZen] = createContextHook<ZenState>(() => {
  const [selectedIntention, setSelectedIntentionState] = useState<string | null>(null);
  const [lastIntentionDate, setLastIntentionDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted state
  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const today = new Date().toDateString();
          
          // Reset intention if it's a new day
          if (parsed.lastIntentionDate !== today) {
            setSelectedIntentionState(null);
            setLastIntentionDate(today);
          } else {
            setSelectedIntentionState(parsed.selectedIntention);
            setLastIntentionDate(parsed.lastIntentionDate);
          }
        }
      } catch (error) {
        console.log('[ZenContext] Error loading zen state:', error);
        if (Platform.OS === 'android') {
          console.log('[ZenContext] Android-specific AsyncStorage error detected');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // Save state when it changes
  const setSelectedIntention = async (intention: string | null) => {
    const today = new Date().toDateString();
    setSelectedIntentionState(intention);
    setLastIntentionDate(today);

    try {
      const stateToSave = JSON.stringify({
        selectedIntention: intention,
        lastIntentionDate: today,
      });
      await AsyncStorage.setItem(STORAGE_KEY, stateToSave);
      console.log('[ZenContext] State saved successfully');
    } catch (error) {
      console.log('[ZenContext] Error saving zen state:', error);
      if (Platform.OS === 'android') {
        console.log('[ZenContext] Android-specific AsyncStorage save error');
      }
    }
  };

  return {
    selectedIntention,
    setSelectedIntention,
    lastIntentionDate,
  };
});
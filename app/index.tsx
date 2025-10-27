import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Sparkles, Wind, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { useZen } from '@/hooks/zen-context';
import { getDailyQuote } from '@/data/quotes';
import { INTENTIONS } from '@/data/intentions';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { selectedIntention, setSelectedIntention } = useZen();
  const [showIntentions, setShowIntentions] = useState(false);
  const [customIntention, setCustomIntention] = useState('');
  const [glowAnim] = useState(new Animated.Value(0));
  const [floatAnim] = useState(new Animated.Value(0));

  const today = new Date();
  const dailyQuote = useMemo(() => getDailyQuote(today), [today.toDateString()]);
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  useEffect(() => {
    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const handleIntentionSelect = (intention: string) => {
    setSelectedIntention(intention);
    setShowIntentions(false);
  };

  const handleCustomIntention = () => {
    if (customIntention.trim()) {
      setSelectedIntention(customIntention.trim());
      setCustomIntention('');
      setShowIntentions(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a0033', '#330066']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          {/* Grid Background Pattern */}
          <View style={styles.gridPattern} />
          
          {/* Header */}
          <View style={styles.header}>
            <Calendar size={24} color="#ff00ff" />
            <Text style={styles.headerText}>DAILY ZEN '85</Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
              testID="settings-button"
            >
              <Settings size={24} color="#00ffff" />
            </TouchableOpacity>
          </View>

          {/* Date Display */}
          <View style={styles.dateContainer}>
            <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
            <Text style={styles.monthDay}>{monthDay}</Text>
          </View>

          {/* Quote Card */}
          <Animated.View 
            style={[
              styles.quoteCard,
              { transform: [{ translateY: floatAnim }] }
            ]}
          >
            <LinearGradient
              colors={['#ff00ff20', '#00ffff20', '#ffff0020']}
              style={styles.quoteGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View 
                style={[
                  styles.glowEffect,
                  { opacity: glowOpacity }
                ]}
              />
              <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
              <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
            </LinearGradient>
          </Animated.View>

          {/* Intention Section */}
          <View style={styles.intentionSection}>
            <Text style={styles.sectionTitle}>TODAY'S INTENTION</Text>
            
            {selectedIntention ? (
              <TouchableOpacity
                style={styles.selectedIntentionCard}
                onPress={() => setShowIntentions(true)}
                testID="selected-intention"
              >
                <LinearGradient
                  colors={['#ff00ff40', '#00ffff40']}
                  style={styles.intentionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.selectedIntentionText}>
                    {selectedIntention}
                  </Text>
                  <Text style={styles.changeText}>TAP TO CHANGE</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.setIntentionButton}
                onPress={() => setShowIntentions(true)}
                testID="set-intention"
              >
                <Text style={styles.setIntentionText}>SET INTENTION</Text>
              </TouchableOpacity>
            )}

            {showIntentions && (
              <View style={styles.intentionsGrid}>
                {INTENTIONS.map((intention, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.intentionOption}
                    onPress={() => handleIntentionSelect(intention)}
                    testID={`intention-${index}`}
                  >
                    <Text style={styles.intentionOptionText}>{intention}</Text>
                  </TouchableOpacity>
                ))}
                
                {/* Custom Intention Input */}
                <View style={styles.customIntentionContainer}>
                  <Text style={styles.customIntentionLabel}>WRITE YOUR OWN</Text>
                  <View style={styles.customIntentionBox}>
                    <TextInput
                      style={styles.customIntentionInput}
                      placeholder="Enter your intention..."
                      placeholderTextColor="#ffffff60"
                      value={customIntention}
                      onChangeText={setCustomIntention}
                      onSubmitEditing={handleCustomIntention}
                      returnKeyType="done"
                      testID="custom-intention-input"
                    />
                    <TouchableOpacity
                      style={styles.customIntentionButton}
                      onPress={handleCustomIntention}
                      testID="custom-intention-submit"
                    >
                      <Text style={styles.customIntentionButtonText}>SET</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Breathe Button */}
          <TouchableOpacity
            style={styles.breatheButton}
            onPress={() => router.push('/breathe')}
            testID="breathe-button"
          >
            <LinearGradient
              colors={['#00ffff', '#ff00ff', '#ffff00']}
              style={styles.breatheGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Wind size={28} color="#000" />
              <Text style={styles.breatheText}>JUST BREATHE TIMER</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Bottom Decoration */}
          <View style={styles.bottomDecoration}>
            <View style={styles.neonLine} />
            <Text style={styles.zenSymbol}>禅</Text>
            <View style={styles.neonLine} />
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.1,
    backgroundColor: 'transparent',
    backgroundImage: Platform.select({
      web: 'repeating-linear-gradient(0deg, #ff00ff 0px, transparent 1px, transparent 40px, #ff00ff 41px), repeating-linear-gradient(90deg, #00ffff 0px, transparent 1px, transparent 40px, #00ffff 41px)',
      default: undefined,
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    gap: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  dayOfWeek: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00ffff',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  monthDay: {
    fontSize: 18,
    color: '#ffff00',
    marginTop: 5,
    letterSpacing: 1,
    textShadowColor: '#ffff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  quoteCard: {
    marginBottom: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  quoteGradient: {
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ff00ff40',
  },
  glowEffect: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    backgroundColor: '#ff00ff',
    borderRadius: 20,
  },
  quoteText: {
    fontSize: 20,
    color: '#fff',
    lineHeight: 30,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 15,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  quoteAuthor: {
    fontSize: 16,
    color: '#00ffff',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  intentionSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ff00ff',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  selectedIntentionCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  intentionGradient: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#00ffff40',
  },
  selectedIntentionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 5,
  },
  changeText: {
    fontSize: 12,
    color: '#ffff00',
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 5,
  },
  setIntentionButton: {
    backgroundColor: '#ff00ff40',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ff00ff',
  },
  setIntentionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 2,
  },
  intentionsGrid: {
    marginTop: 20,
    gap: 10,
  },
  intentionOption: {
    backgroundColor: '#00ffff20',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00ffff40',
  },
  intentionOptionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  breatheButton: {
    marginBottom: 40,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  breatheGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 15,
  },
  breatheText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 3,
  },
  bottomDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  neonLine: {
    width: 60,
    height: 2,
    backgroundColor: '#ff00ff',
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  zenSymbol: {
    fontSize: 32,
    color: '#00ffff',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#00ffff20',
    borderWidth: 1,
    borderColor: '#00ffff40',
  },
  customIntentionContainer: {
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#ff00ff40',
  },
  customIntentionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffff00',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: '#ffff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  customIntentionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customIntentionInput: {
    flex: 1,
    backgroundColor: '#ffffff10',
    borderWidth: 2,
    borderColor: '#ffff0060',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  customIntentionButton: {
    backgroundColor: '#ffff00',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffff00',
  },
  customIntentionButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
  },
});
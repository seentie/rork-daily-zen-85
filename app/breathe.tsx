import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Play, Pause, RotateCcw } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Flower component for lily pads
const LilyFlower = ({ style }: { style?: any }) => {
  const petalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(petalAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(petalAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [petalAnim]);

  const scale = petalAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  return (
    <Animated.View style={[styles.flower, style, { transform: [{ scale }] }]}>
      {/* Petals */}
      <View style={[styles.petal, styles.petal1]} />
      <View style={[styles.petal, styles.petal2]} />
      <View style={[styles.petal, styles.petal3]} />
      <View style={[styles.petal, styles.petal4]} />
      <View style={[styles.petal, styles.petal5]} />
      <View style={[styles.petal, styles.petal6]} />
      <View style={[styles.petal, styles.petal7]} />
      <View style={[styles.petal, styles.petal8]} />
      {/* Center */}
      <View style={styles.flowerCenter} />
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const TIMER_OPTIONS = [
  { label: '1 MIN', seconds: 60 },
  { label: '3 MIN', seconds: 180 },
  { label: '5 MIN', seconds: 300 },
  { label: '10 MIN', seconds: 600 },
];

export default function BreatheScreen() {
  const [selectedTime, setSelectedTime] = useState(180);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
  const [showCloseButton, setShowCloseButton] = useState(false);

  console.log('[BreatheScreen] Render - Platform:', Platform.OS);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Water ripple animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim, rippleAnim]);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsActive(false);
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (isActive) {
      startBreathingAnimation();
    } else {
      stopBreathingAnimation();
    }

    return () => {
      stopBreathingAnimation();
    };
  }, [isActive]);

  const startBreathingAnimation = () => {
    const breatheCycle = () => {
      // Inhale - 4 seconds
      setBreathPhase('inhale');
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        // Hold - 4 seconds
        setBreathPhase('hold');
        
        setTimeout(() => {
          // Exhale - 4 seconds
          setBreathPhase('exhale');
          Animated.timing(scaleAnim, {
            toValue: 0.5,
            duration: 4000,
            useNativeDriver: true,
          }).start();
          
          setTimeout(() => {
            // Hold - 4 seconds
            setBreathPhase('hold2');
          }, 4000);
        }, 4000);
      }, 4000);
    };

    breatheCycle();
    breathIntervalRef.current = setInterval(breatheCycle, 16000);
  };

  const stopBreathingAnimation = () => {
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current);
    }
    Animated.timing(scaleAnim, {
      toValue: 0.5,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleStart = () => {
    console.log('[BreatheScreen] Starting timer');
    setIsActive(true);
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('[BreatheScreen] Haptics error:', error);
      }
    }
  };

  const handlePause = () => {
    console.log('[BreatheScreen] Pausing timer');
    setIsActive(false);
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('[BreatheScreen] Haptics error:', error);
      }
    }
  };

  const handleReset = () => {
    console.log('[BreatheScreen] Resetting timer');
    setIsActive(false);
    setTimeRemaining(selectedTime);
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.log('[BreatheScreen] Haptics error:', error);
      }
    }
  };

  const handleTimeSelect = (seconds: number) => {
    console.log('[BreatheScreen] Time selected:', seconds);
    setSelectedTime(seconds);
    setTimeRemaining(seconds);
    setIsActive(false);
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch (error) {
        console.log('[BreatheScreen] Haptics error:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#1a0033', '#330066', '#4d0099']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Close Button */}
        {showCloseButton && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            testID="close-button"
          >
            <X size={28} color="#fff" />
          </TouchableOpacity>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onTouchStart={() => {
            if (!showCloseButton) {
              setShowCloseButton(true);
            }
          }}
        >
          {/* Title */}
          <Text style={styles.title}>BREATHE</Text>
          <Text style={styles.subtitle}>{breathPhase === 'hold2' ? 'HOLD' : breathPhase.toUpperCase()}</Text>

        {/* Lily Pond */}
        <View style={styles.poolContainer}>
          {/* Pool Background */}
          <View style={styles.poolBackground}>
            <LinearGradient
              colors={['#1a4d66', '#2d6b80', '#4a8fa6', '#6bb3cc']}
              style={styles.poolGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Water ripples */}
            <Animated.View
              style={[
                styles.ripple,
                {
                  opacity: rippleAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.3, 0],
                  }),
                  transform: [{
                    scale: rippleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    })
                  }]
                }
              ]}
            />
            
            {/* Lily pads with flowers */}
            <View style={[styles.lilyPad, styles.lilyPad1]}>
              <LilyFlower style={styles.flowerPosition} />
            </View>
            <View style={[styles.lilyPad, styles.lilyPad2]}>
              <LilyFlower style={styles.flowerPosition} />
            </View>
            <View style={[styles.lilyPad, styles.lilyPad3]}>
              <LilyFlower style={styles.flowerPosition} />
            </View>
            <View style={[styles.lilyPad, styles.lilyPad4]}>
              <LilyFlower style={styles.flowerPosition} />
            </View>
            
            {/* Wooden dock for timer */}
            <View style={styles.woodenDock}>
              {/* Wood grain effect */}
              <View style={styles.woodGrain1} />
              <View style={styles.woodGrain2} />
              <View style={styles.woodGrain3} />
              <View style={styles.woodGrain4} />
              {/* Dock nails/bolts */}
              <View style={[styles.dockNail, styles.nail1]} />
              <View style={[styles.dockNail, styles.nail2]} />
              <View style={[styles.dockNail, styles.nail3]} />
              <View style={[styles.dockNail, styles.nail4]} />
            </View>
            

          </View>
          
          {/* Rotating border */}
          <Animated.View
            style={[
              styles.poolBorder,
              { transform: [{ rotate: rotation }] }
            ]}
          />
          
          {/* Breathing Circle */}
          <Animated.View
            style={[
              styles.breathingCircle,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <LinearGradient
              colors={['#ff00ff40', '#00ffff40', '#ffff0040']}
              style={styles.circleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          
          {/* Timer on lily pad */}
          <View style={styles.timerDisplay}>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            </View>
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.timeSelection}>
          {TIMER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.seconds}
              style={[
                styles.timeOption,
                selectedTime === option.seconds && styles.timeOptionActive
              ]}
              onPress={() => handleTimeSelect(option.seconds)}
              testID={`time-${option.seconds}`}
            >
              <Text style={[
                styles.timeOptionText,
                selectedTime === option.seconds && styles.timeOptionTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Control Buttons */}
        <View style={styles.controls}>
          {!isActive ? (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleStart}
              testID="start-button"
            >
              <LinearGradient
                colors={['#00ffff', '#ff00ff']}
                style={styles.controlGradient}
              >
                <Play size={32} color="#000" fill="#000" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePause}
              testID="pause-button"
            >
              <LinearGradient
                colors={['#ffff00', '#ff00ff']}
                style={styles.controlGradient}
              >
                <Pause size={32} color="#000" fill="#000" />
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleReset}
            testID="reset-button"
          >
            <View style={styles.resetButton}>
              <RotateCcw size={28} color="#00ffff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>INHALE • 4s</Text>
          <Text style={styles.instructionText}>HOLD • 4s</Text>
          <Text style={styles.instructionText}>EXHALE • 4s</Text>
          <Text style={styles.instructionText}>HOLD • 4s</Text>
        </View>
        </ScrollView>
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
    alignItems: 'center',
    paddingBottom: 60,
    paddingTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 5,
    marginTop: 60,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 18,
    color: '#00ffff',
    letterSpacing: 3,
    marginTop: 10,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  poolContainer: {
    width: Math.min(width * 0.85, 400),
    height: Math.min(width * 0.85, 400),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  poolBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: Math.min(width * 0.425, 200),
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#1a4d66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  poolGradient: {
    flex: 1,
  },
  poolBorder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: Math.min(width * 0.425, 200),
    borderWidth: 3,
    borderColor: '#ff00ff30',
    borderStyle: 'dashed',
  },
  ripple: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: Math.min(width * 0.34, 160),
    borderWidth: 2,
    borderColor: '#ffffff40',
    top: '10%',
    left: '10%',
  },
  lilyPad: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: '#2d5016',
    borderRadius: 15,
    borderTopRightRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  woodenDock: {
    position: 'absolute',
    width: 140,
    height: 140,
    backgroundColor: '#8b6f47',
    borderRadius: 70,
    top: '50%',
    left: '50%',
    marginTop: -70,
    marginLeft: -70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: '#6b5637',
    overflow: 'hidden',
  },
  woodGrain1: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#6b5637',
    top: '20%',
    opacity: 0.5,
  },
  woodGrain2: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#5a4528',
    top: '40%',
    opacity: 0.4,
  },
  woodGrain3: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#6b5637',
    top: '60%',
    opacity: 0.5,
  },
  woodGrain4: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#5a4528',
    top: '80%',
    opacity: 0.4,
  },
  dockNail: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#4a3c28',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  nail1: {
    top: 15,
    left: 15,
  },
  nail2: {
    top: 15,
    right: 15,
  },
  nail3: {
    bottom: 15,
    left: 15,
  },
  nail4: {
    bottom: 15,
    right: 15,
  },
  flower: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petal: {
    position: 'absolute',
    width: 6,
    height: 10,
    backgroundColor: '#ff69b4',
    borderRadius: 3,
    shadowColor: '#ff1493',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  flowerCenter: {
    width: 4,
    height: 4,
    backgroundColor: '#ffd700',
    borderRadius: 2,
    shadowColor: '#ffa500',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  breathingCircle: {
    width: Math.min(width * 0.7, 330),
    height: Math.min(width * 0.7, 330),
    borderRadius: Math.min(width * 0.35, 165),
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
  },
  circleGradient: {
    flex: 1,
    opacity: 0.8,
  },
  timerDisplay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  timerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  timerText: {
    fontSize: 38,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 4,
    fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace', web: 'Courier New, monospace' }) as 'monospace',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  timeSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 25,
    marginTop: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  timeOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ff00ff40',
    backgroundColor: '#ff00ff10',
  },
  timeOptionActive: {
    backgroundColor: '#ff00ff40',
    borderColor: '#ff00ff',
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
  },
  timeOptionTextActive: {
    color: '#ffff00',
    textShadowColor: '#ffff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 25,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
  },
  controlGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00ffff20',
    borderWidth: 2,
    borderColor: '#00ffff40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 10,
    marginBottom: 30,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 12,
    color: '#ffff00',
    letterSpacing: 1,
    textShadowColor: '#ffff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  lilyPad1: {
    top: '15%',
    left: '10%',
  },
  lilyPad2: {
    top: '65%',
    right: '15%',
    transform: [{ rotate: '45deg' }],
  },
  lilyPad3: {
    bottom: '20%',
    left: '20%',
    transform: [{ rotate: '-30deg' }],
  },
  lilyPad4: {
    top: '30%',
    right: '10%',
    transform: [{ rotate: '60deg' }],
  },
  flowerPosition: {
    position: 'absolute',
    top: 5,
    left: 5,
  },

  petal1: {
    top: -3,
    left: 3,
  },
  petal2: {
    top: 1,
    left: -1,
    transform: [{ rotate: '45deg' }],
  },
  petal3: {
    top: 5,
    left: 3,
    transform: [{ rotate: '90deg' }],
  },
  petal4: {
    top: 1,
    left: 7,
    transform: [{ rotate: '135deg' }],
  },
  petal5: {
    top: -3,
    left: 3,
    transform: [{ rotate: '180deg' }],
  },
  petal6: {
    top: 1,
    left: -1,
    transform: [{ rotate: '225deg' }],
  },
  petal7: {
    top: 5,
    left: 3,
    transform: [{ rotate: '270deg' }],
  },
  petal8: {
    top: 1,
    left: 7,
    transform: [{ rotate: '315deg' }],
  },
});
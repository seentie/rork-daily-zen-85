import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Shield, Heart, Mail, ExternalLink, Info, Globe, User } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const APP_VERSION = '1.0';
const SUPPORT_EMAIL = 'sarah@oldskoolapps.com';
const POLICY_UPDATED = 'November 2025';
const DEVELOPER_NAME = 'OLD SKOOL APPS';
const DEVELOPER_WEBSITE = 'https://www.oldskoolapps.com';
const DEVELOPER_ADDRESS = '2114 N Flamingo Road #867, Pembroke Pines, FL 33028';
const DEVELOPER_PHONE = '(646)-540-9602';

export default function SettingsScreen() {
  const handleEmailSupport = async () => {
    console.log('[Settings] Opening email support');
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('[Settings] Haptics error:', error);
      }
    }
    
    const subject = encodeURIComponent('Daily Zen - Support Request');
    const body = encodeURIComponent(`
App Version: ${APP_VERSION}
Platform: ${Platform.OS}
Device: ${Platform.select({ ios: 'iOS', android: 'Android', web: 'Web' })}

Please describe your issue or feedback:

`);
    
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    
    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        console.log('Mail app not available. Please email:', SUPPORT_EMAIL);
      }
    } catch (error) {
      console.error('Error opening mail app:', error);
    }
  };

  const handleOpenWebsite = async () => {
    console.log('[Settings] Opening website');
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('[Settings] Haptics error:', error);
      }
    }
    
    try {
      const canOpen = await Linking.canOpenURL(DEVELOPER_WEBSITE);
      if (canOpen) {
        await Linking.openURL(DEVELOPER_WEBSITE);
      }
    } catch (error) {
      console.error('Error opening website:', error);
    }
  };



  const handleClose = async () => {
    console.log('[Settings] Closing settings');
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('[Settings] Haptics error:', error);
      }
    }
    router.back();
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    onPress,
    showArrow = false 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    description?: string; 
    onPress?: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
      testID={`setting-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <View style={styles.settingIcon}>
        <Text>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {showArrow && (
        <ExternalLink size={16} color="#00ffff" style={styles.settingArrow} />
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a0033', '#330066']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            testID="close-settings"
          >
            <X size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SETTINGS</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Breathing Technique */}
          <SettingSection title="BREATHING TECHNIQUE">
            <View style={styles.legalText}>
              <Text style={styles.legalTitle}>Box Breathing</Text>
              <Text style={styles.legalContent}>
                Box breathing, also known as square breathing, is a relaxation technique that involves a specific pattern of inhaling, holding, exhaling, and holding again.
              </Text>

              <Text style={styles.legalTitle}>Steps</Text>
              <Text style={styles.legalContent}>
                1. Inhale slowly for a count of four.{'\n'}
                2. Hold your breath for a count of four.{'\n'}
                3. Exhale slowly for a count of four.{'\n'}
                4. Hold your breath again for a count of four.{'\n\n'}
                Repeat this cycle for several minutes.
              </Text>

              <Text style={styles.legalTitle}>Benefits</Text>
              <Text style={styles.legalContent}>
                • Reduces stress and anxiety{'\n'}
                • Calms the mind and body{'\n'}
                • Improves focus and concentration{'\n'}
                • Regulates breathing and heart rate{'\n'}
                • Promotes relaxation and sleep
              </Text>

              <Text style={styles.legalTitle}>When to Use</Text>
              <Text style={styles.legalContent}>
                Box breathing can be used in various situations, such as:{'\n\n'}
                • During stressful moments{'\n'}
                • Before public speaking or exams{'\n'}
                • When feeling anxious or overwhelmed{'\n'}
                • To improve sleep quality
              </Text>

              <Text style={styles.legalTitle}>Precautions</Text>
              <Text style={styles.legalContent}>
                • If you have any respiratory conditions, consult your doctor before practicing box breathing.{'\n'}
                • Start slowly and gradually increase the duration of each breath.{'\n'}
                • If you feel lightheaded or dizzy, stop and rest.{'\n\n'}
                Note: Box breathing is a simple and accessible relaxation technique, but it&apos;s important to practice it regularly to experience its full benefits.
              </Text>
            </View>
          </SettingSection>

          {/* Privacy Section */}
          <SettingSection title="PRIVACY & DATA">
            <SettingItem
              icon={<Shield size={24} color="#00ffff" />}
              title="Privacy Overview"
              description="We don't track you. We don't collect your data. We don't sell anything to anyone. You do you."
            />
            <SettingItem
              icon={<Info size={24} color="#ff00ff" />}
              title="Local Storage"
              description="All data stays on your device. Not our servers. Not the cloud. Just your device."
            />
            <SettingItem
              icon={<Heart size={24} color="#ffff00" />}
              title="Your Privacy"
              description="Your business is your business. We're old skool about privacy too."
            />
          </SettingSection>

          {/* Contact & Support */}
          <SettingSection title="CONTACT & SUPPORT">
            <SettingItem
              icon={<Mail size={24} color="#00ffff" />}
              title="Email Support"
              description="Get help or share feedback"
              onPress={handleEmailSupport}
              showArrow={true}
            />
            <SettingItem
              icon={<Globe size={24} color="#ff00ff" />}
              title="Visit Our Website"
              description="Learn more about our apps"
              onPress={handleOpenWebsite}
              showArrow={true}
            />
            <SettingItem
              icon={<User size={24} color="#ffff00" />}
              title="Developer"
              description={DEVELOPER_NAME}
            />
          </SettingSection>

          {/* App Information */}
          <SettingSection title="APP INFORMATION">
            <SettingItem
              icon={<Info size={24} color="#00ffff" />}
              title="App Name"
              description="Daily Zen '85"
            />
            <SettingItem
              icon={<Heart size={24} color="#ff00ff" />}
              title="Subtitle"
              description="Meditate Your Way to Namaste"
            />
            <SettingItem
              icon={<Info size={24} color="#ffff00" />}
              title="Version"
              description={APP_VERSION}
            />
            <SettingItem
              icon={<Heart size={24} color="#ff6b6b" />}
              title="Made with Love"
              description="Crafted for mindfulness and inner peace"
            />
          </SettingSection>

          {/* Legal Information */}
          <SettingSection title="LEGAL & POLICIES">
            <SettingItem
              icon={<Mail size={24} color="#00ffff" />}
              title="Contact Email"
              description={SUPPORT_EMAIL}
            />
            <SettingItem
              icon={<Info size={24} color="#ff00ff" />}
              title="Address"
              description={DEVELOPER_ADDRESS}
            />
            <SettingItem
              icon={<Info size={24} color="#ffff00" />}
              title="Phone"
              description={DEVELOPER_PHONE}
            />
            
            <View style={styles.legalText}>
              <Text style={styles.legalTitle}>Privacy Policy</Text>
              <Text style={styles.legalContent}>
                Updated: {POLICY_UPDATED}{'\n\n'}
              </Text>
              
              <Text style={styles.legalTitle}>The Short Version</Text>
              <Text style={styles.legalContent}>
                We don&apos;t track you. We don&apos;t collect your data. We don&apos;t sell anything to anyone. You do you.
              </Text>

              <Text style={styles.legalTitle}>The Slightly Longer Version</Text>
              <Text style={styles.legalContent}>
                Old Skool Apps believes your business is your business. Here&apos;s what that means:
              </Text>

              <Text style={styles.legalTitle}>What We Don&apos;t Collect</Text>
              <Text style={styles.legalContent}>
                • Personal information{'\n'}
                • Usage data{'\n'}
                • Location data{'\n'}
                • Device information{'\n'}
                • Cookies or tracking pixels{'\n'}
                • Analytics{'\n'}
                • Literally anything about you
              </Text>

              <Text style={styles.legalTitle}>What We Don&apos;t Do</Text>
              <Text style={styles.legalContent}>
                • Track your activity{'\n'}
                • Sell your data{'\n'}
                • Share information with third parties{'\n'}
                • Send you marketing emails (unless you explicitly sign up){'\n'}
                • Connect to social media{'\n'}
                • Use creepy ad networks
              </Text>

              <Text style={styles.legalTitle}>What Happens on Your Device Stays on Your Device</Text>
              <Text style={styles.legalContent}>
                All our apps store data locally on your device. Your journals, lists, birthdays, contacts, preferences—everything lives on your phone or tablet. Not our servers. Not the cloud (unless you choose to back up via your device&apos;s built-in backup features).{'\n\n'}
                If you delete the app, your data goes with it. We never see it in the first place.
              </Text>

              <Text style={styles.legalTitle}>Third-Party Services</Text>
              <Text style={styles.legalContent}>
                Some apps may use your device&apos;s built-in features (like photo library access or camera) but only when you give permission, and only to make the app work. We don&apos;t send that data anywhere.
              </Text>

              <Text style={styles.legalTitle}>Changes to This Policy</Text>
              <Text style={styles.legalContent}>
                If we ever change this policy (spoiler: we probably won&apos;t), we&apos;ll update this page and the date at the top. But our philosophy stays the same: your data is yours.
              </Text>

              <Text style={styles.legalTitle}>Medical Disclaimer</Text>
              <Text style={styles.legalContent}>
                This app is designed for relaxation and mindfulness practice. It is not intended to diagnose, treat, cure, or prevent any medical condition. Please consult with healthcare professionals for medical advice.
              </Text>

              <Text style={styles.legalTitle}>Questions?</Text>
              <Text style={styles.legalContent}>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:{'\n\n'}
                Email: {SUPPORT_EMAIL}{'\n'}
                We&apos;re real humans who do respond.{'\n\n'}
                Address: {DEVELOPER_ADDRESS}{'\n'}
                Phone: {DEVELOPER_PHONE}{'\n\n'}
                We&apos;re old skool about apps, and privacy too. You do you.{'\n\n'}
                Old Skool Apps{'\n'}
                Where nostalgia meets function, and your privacy is actually yours.
              </Text>
            </View>
          </SettingSection>

          {/* Bottom Decoration */}
          <View style={styles.bottomDecoration}>
            <View style={styles.neonLine} />
            <Text style={styles.zenSymbol}>禅</Text>
            <View style={styles.neonLine} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ff00ff20',
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ff00ff20',
    borderWidth: 1,
    borderColor: '#ff00ff40',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#00ffff',
    letterSpacing: 2,
    marginBottom: 15,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ff00ff10',
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ff00ff20',
  },
  settingIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
    letterSpacing: 1,
  },
  settingDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  settingArrow: {
    marginLeft: 10,
    marginTop: 2,
  },
  legalText: {
    backgroundColor: '#00ffff10',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#00ffff20',
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffff00',
    marginBottom: 8,
    marginTop: 15,
    letterSpacing: 1,
    textShadowColor: '#ffff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  legalContent: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  bottomDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
    marginBottom: 20,
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
});
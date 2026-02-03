/**
 * Home Screen - Form Selection with India-First UI & AI Assist Toggle
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getFormTemplate, getAvailableFormTypes } from '@/services/gemini';
import { translations } from '@/services/i18n';

export default function HomeScreen() {
  const colors = Colors.light;
  const router = useRouter();
  const formTypes = getAvailableFormTypes();
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const [aiAssistEnabled, setAiAssistEnabled] = useState(false);

  const selectForm = (formType: string) => {
    const formTemplate = getFormTemplate(formType);

    router.push({
      pathname: '/form-input',
      params: {
        formName: formTemplate.formName,
        formType: formType,
        fields: JSON.stringify(formTemplate.fields),
        aiAssist: aiAssistEnabled ? 'true' : 'false',
      },
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.mainContent}>
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: '#2B6CB0' }]}>
          <View style={styles.headerLeft}>
            <View>
              <Text style={[styles.titleEnglish, { color: '#FFFFFF' }]}>
                Aadhaar Form Assistant
              </Text>
              <Text style={[styles.titleHindi, { color: 'rgba(255,255,255,0.8)' }]}>
                आधार फॉर्म सहायक
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={toggleLanguage}
            style={[styles.langToggle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          >
            <Text style={[styles.langToggleText, { color: '#FFFFFF' }]}>
              {language === 'en' ? 'हिं' : 'EN'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>

          {/* AI Assist Toggle */}
          <Card style={[
            styles.aiToggleCard,
            {
              borderColor: aiAssistEnabled ? colors.success : colors.border,
              backgroundColor: aiAssistEnabled ? '#F0FFF4' : colors.surface,
            }
          ]}>
            <View style={styles.aiToggleContent}>
              <View style={[
                styles.aiIconBg,
                { backgroundColor: aiAssistEnabled ? '#C6F6D5' : colors.border }
              ]}>
                <Text style={styles.aiIcon}>🤖</Text>
              </View>
              <View style={styles.aiToggleInfo}>
                <Text style={[styles.aiToggleTitleEn, { color: colors.text }]}>
                  {translations.aiAssist.en}
                </Text>
                <Text style={[styles.aiToggleTitleHi, { color: colors.textSecondary }]}>
                  {translations.aiAssist.hi}
                </Text>
                <Text style={[styles.aiToggleDesc, { color: colors.textMuted }]}>
                  {language === 'en'
                    ? 'Helps format names & addresses'
                    : 'नाम और पता सुधारने में मदद'
                  }
                </Text>
              </View>
              <Switch
                value={aiAssistEnabled}
                onValueChange={setAiAssistEnabled}
                trackColor={{ false: '#E2E8F0', true: '#68D391' }}
                thumbColor={aiAssistEnabled ? '#38A169' : '#CBD5E0'}
              />
            </View>
            {aiAssistEnabled && (
              <View style={[styles.aiStatusBanner, { backgroundColor: '#C6F6D5' }]}>
                <Text style={{ color: '#276749', fontWeight: '700' }}>✓</Text>
                <Text style={[styles.aiStatusText, { color: '#276749' }]}>
                  {language === 'en' ? 'AI Assist is ON' : 'AI सहायता चालू है'}
                </Text>
              </View>
            )}
          </Card>

          {/* Subtitle */}
          <View style={styles.subtitleContainer}>
            <Text style={[styles.subtitleEnglish, { color: colors.textSecondary }]}>
              {language === 'en' ? 'Select form to fill' : 'भरने के लिए फॉर्म चुनें'}
            </Text>
          </View>

          {/* Form Selection */}
          <View style={styles.formList}>
            {formTypes.map((form) => (
              <TouchableOpacity
                key={form.id}
                activeOpacity={0.7}
                onPress={() => selectForm(form.id)}
              >
                <Card style={[styles.formCard, { borderColor: colors.border }]}>
                  <View style={styles.formCardContent}>
                    <View style={[styles.iconCircle, { backgroundColor: colors.accentLight }]}>
                      <Text style={styles.iconEmoji}>{form.icon}</Text>
                    </View>
                    <View style={styles.formInfo}>
                      <Text style={[styles.formTitleEn, { color: colors.text }]}>
                        {form.name} Form
                      </Text>
                      <Text style={[styles.formTitleHi, { color: colors.textSecondary }]}>
                        आधार कार्ड फॉर्म
                      </Text>
                      <Text style={[styles.formDescription, { color: colors.accent }]}>
                        {language === 'en' ? 'Start filling →' : 'शुरू करें →'}
                      </Text>
                    </View>
                    <View style={[styles.arrowCircle, { backgroundColor: colors.primary }]}>
                      <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Card: How It Works */}
          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={[styles.infoIconBg, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="information-circle" size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.infoTitle, { color: colors.text }]}>
                  {language === 'en' ? 'How it works?' : 'कैसे काम करता है?'}
                </Text>
              </View>
            </View>
            <View style={styles.stepsContainer}>
              <View style={styles.stepRow}>
                <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={[styles.stepTextEn, { color: colors.text }]}>
                    Answer simple questions
                  </Text>
                  <Text style={[styles.stepTextHi, { color: colors.textSecondary }]}>
                    सवालों के जवाब दें
                  </Text>
                </View>
              </View>
              <View style={styles.stepRow}>
                <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={[styles.stepTextEn, { color: colors.text }]}>
                    {aiAssistEnabled ? 'AI will improve your answers' : 'See your filled form'}
                  </Text>
                  <Text style={[styles.stepTextHi, { color: colors.textSecondary }]}>
                    {aiAssistEnabled ? 'AI आपके जवाब सुधारेगा' : 'भरा हुआ फॉर्म देखें'}
                  </Text>
                </View>
              </View>
              <View style={styles.stepRow}>
                <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={[styles.stepTextEn, { color: colors.text }]}>
                    Share or Save your form
                  </Text>
                  <Text style={[styles.stepTextHi, { color: colors.textSecondary }]}>
                    शेयर करें या फॉर्म सेव करें
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* AI Features Card - Show when AI is enabled */}
          {aiAssistEnabled && (
            <Card style={[styles.infoCard, { borderLeftWidth: 4, borderLeftColor: colors.success }]}>
              <View style={styles.infoHeader}>
                <Text style={styles.aiFeatureEmoji}>✨</Text>
                <View>
                  <Text style={[styles.infoTitle, { color: colors.success }]}>
                    {language === 'hi' ? 'AI क्या करेगा?' : 'What AI will do?'}
                  </Text>
                </View>
              </View>
              <View style={styles.reasonsList}>
                <View style={styles.reasonItem}>
                  <Text style={styles.reasonBullet}>•</Text>
                  <Text style={[styles.reasonText, { color: colors.text }]}>
                    {language === 'hi'
                      ? 'नाम को सही CAPITAL LETTERS में बदलेगा'
                      : 'Convert names to proper CAPITAL LETTERS'
                    }
                  </Text>
                </View>
                <View style={styles.reasonItem}>
                  <Text style={styles.reasonBullet}>•</Text>
                  <Text style={[styles.reasonText, { color: colors.text }]}>
                    {language === 'hi'
                      ? 'पता को सही format में लिखेगा'
                      : 'Format address properly'
                    }
                  </Text>
                </View>
                <View style={styles.reasonItem}>
                  <Text style={styles.reasonBullet}>•</Text>
                  <Text style={[styles.reasonText, { color: colors.text }]}>
                    {language === 'hi'
                      ? 'Initials को पूरे नाम में expand करेगा'
                      : 'Expand initials to full names'
                    }
                  </Text>
                </View>
              </View>
              <Text style={[styles.aiNote, { color: colors.textMuted }]}>
                {language === 'hi'
                  ? '⚡ इंटरनेट आवश्यक • कम डेटा उपयोग'
                  : '⚡ Requires internet • Low data usage'
                }
              </Text>
            </Card>
          )}

          {/* Info Card: Why Forms Get Rejected */}
          {/* <Card style={[styles.infoCard, { borderLeftWidth: 4, borderLeftColor: colors.warning }]}>
          <View style={styles.infoHeader}>
            <Text style={styles.warningEmoji}>⚠️</Text>
            <View>
              <Text style={[styles.infoTitle, { color: colors.warning }]}>
                {translations.whyRejected.title[language]}
              </Text>
            </View>
          </View>
          <View style={styles.reasonsList}>
            {translations.whyRejected.reasons.slice(0, 3).map((reason, index) => (
              <View key={index} style={styles.reasonItem}>
                <Text style={styles.reasonBullet}>•</Text>
                <Text style={[styles.reasonText, { color: colors.text }]}>
                  {reason[language]}
                </Text>
              </View>
            ))}
          </View>
        </Card> */}

          {/* Coming Soon */}
          {/* <View style={styles.comingSoon}>
          <Text style={[styles.comingSoonTitle, { color: colors.textMuted }]}>
            {language === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon'}
          </Text>
          <View style={styles.comingSoonForms}>
            <View style={[styles.comingSoonBadge, { backgroundColor: colors.border }]}>
              <Text style={styles.comingSoonText}>💳 PAN Card</Text>
            </View>
            <View style={[styles.comingSoonBadge, { backgroundColor: colors.border }]}>
              <Text style={styles.comingSoonText}>📘 Passport</Text>
            </View>
            <View style={[styles.comingSoonBadge, { backgroundColor: colors.border }]}>
              <Text style={styles.comingSoonText}>🗳️ Voter ID</Text>
            </View>
          </View>
        </View> */}
        </View>

        {/* Footer Trust Badge */}
        {/* <View style={styles.footer}>
          <View style={styles.trustBadgeCompact}>
            <Ionicons name="shield-checkmark" size={14} color={colors.success} />
            <Text style={[styles.trustText, { color: colors.textMuted }]}>
              {language === 'hi'
                ? 'आपका डेटा सुरक्षित है • ऑफलाइन काम करता है'
                : 'Your data is secure • Works offline'
              }
            </Text>
          </View>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: Spacing.md,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  accentBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  titleEnglish: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  titleHindi: {
    fontSize: FontSize.md,
  },
  langToggle: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  langToggleText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  aiToggleCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
  },
  aiToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  aiIcon: {
    fontSize: 24,
  },
  aiToggleInfo: {
    flex: 1,
  },
  aiToggleTitleEn: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  aiToggleTitleHi: {
    fontSize: FontSize.sm,
  },
  aiToggleDesc: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  aiStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  aiStatusText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  subtitleContainer: {
    marginBottom: Spacing.md,
  },
  subtitleEnglish: {
    fontSize: FontSize.md,
  },
  formList: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  formCard: {
    padding: Spacing.lg,
    borderWidth: 1,
  },
  formCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconEmoji: {
    fontSize: 32,
  },
  formInfo: {
    flex: 1,
  },
  formTitleEn: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  formTitleHi: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.xs,
  },
  formDescription: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  infoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningEmoji: {
    fontSize: 24,
  },
  aiFeatureEmoji: {
    fontSize: 24,
  },
  infoTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  stepsContainer: {
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTextEn: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  stepTextHi: {
    fontSize: FontSize.xs,
  },
  reasonsList: {
    gap: Spacing.xs,
  },
  reasonItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  reasonBullet: {
    fontSize: FontSize.md,
  },
  reasonText: {
    fontSize: FontSize.sm,
    flex: 1,
  },
  aiNote: {
    fontSize: FontSize.xs,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  comingSoon: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  comingSoonTitle: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
  comingSoonForms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  comingSoonBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  comingSoonText: {
    fontSize: FontSize.sm,
    color: '#666',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  trustText: {
    fontSize: FontSize.xs,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  trustBadgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});

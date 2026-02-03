/**
 * Home Screen - MVP Version
 * User selects form type, then uploads image
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getFormTemplate, getAvailableFormTypes, AnalysisResult } from '@/services/gemini';

export default function HomeScreen() {
  const colors = Colors.light;
  const router = useRouter();

  const [selectedFormType, setSelectedFormType] = useState<string | null>(null);
  const formTypes = getAvailableFormTypes();

  const pickImage = async (useCamera: boolean = false) => {
    if (!selectedFormType) {
      Alert.alert('Select Form Type', 'Please select the type of form first.');
      return;
    }

    try {
      let result;

      if (useCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission needed', 'Camera permission is required.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const formTemplate = getFormTemplate(selectedFormType);

        // Navigate directly to form input - no API call needed!
        router.push({
          pathname: '/form-input',
          params: {
            imageUri: imageUri,
            formName: formTemplate.formName,
            fields: JSON.stringify(formTemplate.fields),
          },
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Form Filler
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Fill government forms easily
          </Text>
        </View>

        {/* Step 1: Select Form Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            STEP 1: Select Form Type
          </Text>
          <View style={styles.formTypeGrid}>
            {formTypes.map((formType) => (
              <TouchableOpacity
                key={formType.id}
                style={[
                  styles.formTypeCard,
                  {
                    backgroundColor: selectedFormType === formType.id ? colors.primary : colors.surface,
                    borderColor: selectedFormType === formType.id ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => setSelectedFormType(formType.id)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name="doc.text.fill"
                  size={24}
                  color={selectedFormType === formType.id ? '#FFFFFF' : colors.primary}
                />
                <Text
                  style={[
                    styles.formTypeName,
                    { color: selectedFormType === formType.id ? '#FFFFFF' : colors.text }
                  ]}
                  numberOfLines={2}
                >
                  {formType.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 2: Upload Form */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            STEP 2: Upload Your Form
          </Text>
          <Card style={styles.uploadCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
              <IconSymbol name="camera.fill" size={40} color={colors.primary} />
            </View>

            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Take a photo or select the form you want to fill
            </Text>

            <View style={styles.buttonGroup}>
              <Button
                title="Take Photo"
                onPress={() => pickImage(true)}
                variant="primary"
                fullWidth
                disabled={!selectedFormType}
                icon={<IconSymbol name="camera.fill" size={20} color="#FFFFFF" />}
                style={styles.button}
              />
              <Button
                title="Choose from Gallery"
                onPress={() => pickImage(false)}
                variant="outline"
                fullWidth
                disabled={!selectedFormType}
                icon={<IconSymbol name="photo.fill" size={20} color={colors.primary} />}
                style={styles.button}
              />
            </View>

            {!selectedFormType && (
              <Text style={[styles.hintText, { color: colors.textMuted }]}>
                ☝️ Select a form type above first
              </Text>
            )}
          </Card>
        </View>
      </ScrollView>
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
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.hero,
    fontWeight: '700',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  formTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  formTypeCard: {
    width: '48%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  formTypeName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  uploadCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  cardDescription: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  buttonGroup: {
    width: '100%',
    gap: Spacing.md,
  },
  button: {
    marginBottom: 0,
  },
  hintText: {
    fontSize: FontSize.sm,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});

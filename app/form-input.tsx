/**
 * Form Input Screen
 * Dynamic step-by-step input for form fields
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { FormField, generateFilledForm } from '@/services/gemini';

export default function FormInputScreen() {
    const colors = Colors.light; // Force light mode
    const router = useRouter();
    const params = useLocalSearchParams();

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [fields, setFields] = useState<FormField[]>([]);

    const imageUri = params.imageUri as string;
    const formName = params.formName as string || 'Form';

    useEffect(() => {
        if (params.fields) {
            try {
                const parsedFields = JSON.parse(params.fields as string);
                setFields(parsedFields);
            } catch (e) {
                console.error('Failed to parse fields:', e);
            }
        }
    }, [params.fields]);

    const currentField = fields[currentStep];
    const totalSteps = fields.length;
    const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

    const handleNext = () => {
        // Validate current field if required
        if (currentField?.required && !formData[currentField.id]?.trim()) {
            Alert.alert('Required Field', `Please fill in ${currentField.label}`);
            return;
        }

        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleGenerate();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const handleInputChange = (value: string) => {
        if (currentField) {
            setFormData({ ...formData, [currentField.id]: value });
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Navigate to result screen with form data
            router.replace({
                pathname: '/result',
                params: {
                    imageUri: imageUri,
                    formName: formName,
                    formData: JSON.stringify(formData),
                },
            });
        } catch (error: any) {
            Alert.alert('Generation Failed', error.message || 'Could not generate the filled form.');
            setIsGenerating(false);
        }
    };

    const handleSelectOption = (option: string) => {
        if (currentField) {
            setFormData({ ...formData, [currentField.id]: option });
        }
    };

    if (fields.length === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        Loading form fields...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <IconSymbol name="chevron.left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                            {formName}
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                            Step {currentStep + 1} of {totalSteps}
                        </Text>
                    </View>
                    <View style={styles.headerRight} />
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                        <View
                            style={[
                                styles.progressFill,
                                { backgroundColor: colors.primary, width: `${progress}%` }
                            ]}
                        />
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Current Field Card */}
                    <Card style={styles.fieldCard}>
                        <View style={[styles.fieldIconContainer, { backgroundColor: colors.primaryLight }]}>
                            <IconSymbol
                                name={currentField?.type === 'date' ? 'calendar' : 'pencil'}
                                size={28}
                                color={colors.primary}
                            />
                        </View>

                        <Text style={[styles.fieldLabel, { color: colors.text }]}>
                            {currentField?.label}
                            {currentField?.required && (
                                <Text style={{ color: colors.error }}> *</Text>
                            )}
                        </Text>

                        {currentField?.type === 'select' && currentField.options ? (
                            <View style={styles.optionsContainer}>
                                {currentField.options.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.optionButton,
                                            {
                                                backgroundColor: formData[currentField.id] === option
                                                    ? colors.primary
                                                    : colors.surface,
                                                borderColor: formData[currentField.id] === option
                                                    ? colors.primary
                                                    : colors.border,
                                            }
                                        ]}
                                        onPress={() => handleSelectOption(option)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                {
                                                    color: formData[currentField.id] === option
                                                        ? '#FFFFFF'
                                                        : colors.text,
                                                }
                                            ]}
                                        >
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <Input
                                value={formData[currentField?.id || ''] || ''}
                                onChangeText={handleInputChange}
                                placeholder={currentField?.placeholder}
                                keyboardType={currentField?.type === 'number' ? 'numeric' : 'default'}
                                autoFocus
                                containerStyle={styles.inputContainer}
                            />
                        )}
                    </Card>

                    {/* Quick Tips */}
                    {currentField?.placeholder && (
                        <View style={[styles.tipContainer, { backgroundColor: colors.primaryLight }]}>
                            <IconSymbol name="lightbulb.fill" size={16} color={colors.primary} />
                            <Text style={[styles.tipText, { color: colors.primary }]}>
                                Example: {currentField.placeholder}
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Actions */}
                <View style={[styles.bottomActions, { borderTopColor: colors.border }]}>
                    <Button
                        title={currentStep === totalSteps - 1 ? 'Generate Form' : 'Next'}
                        onPress={handleNext}
                        loading={isGenerating}
                        fullWidth
                        size="lg"
                        icon={
                            !isGenerating && (
                                <IconSymbol
                                    name={currentStep === totalSteps - 1 ? 'wand.and.stars' : 'arrow.right'}
                                    size={20}
                                    color="#FFFFFF"
                                />
                            )
                        }
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
    },
    backButton: {
        padding: Spacing.sm,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: '600',
    },
    headerSubtitle: {
        fontSize: FontSize.sm,
    },
    headerRight: {
        width: 40,
    },
    progressContainer: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    progressTrack: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.lg,
    },
    fieldCard: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    fieldIconContainer: {
        width: 64,
        height: 64,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    fieldLabel: {
        fontSize: FontSize.xl,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 0,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Spacing.sm,
        width: '100%',
    },
    optionButton: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        minWidth: 100,
        alignItems: 'center',
    },
    optionText: {
        fontSize: FontSize.md,
        fontWeight: '500',
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.md,
        gap: Spacing.sm,
    },
    tipText: {
        fontSize: FontSize.sm,
        flex: 1,
    },
    bottomActions: {
        padding: Spacing.lg,
        borderTopWidth: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: FontSize.md,
    },
});

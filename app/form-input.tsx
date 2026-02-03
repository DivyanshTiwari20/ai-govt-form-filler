/**
 * Form Input Screen
 * Dynamic step-by-step input with validation, bilingual labels, and AI assist
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { FormField } from '@/services/gemini';
import { getValidator, formatName, formatDate, formatMobile, calculateReadinessScore } from '@/services/validation';
import { translations } from '@/services/i18n';
import { processFieldWithAI } from '@/services/aiAssist';

export default function FormInputScreen() {
    const colors = Colors.light;
    const router = useRouter();
    const params = useLocalSearchParams();

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [fields, setFields] = useState<FormField[]>([]);
    const [validationError, setValidationError] = useState<{ hi: string; en: string } | null>(null);
    const [language, setLanguage] = useState<'hi' | 'en'>('en');

    const formName = params.formName as string || 'Form';
    const formType = params.formType as string || 'generic';
    const aiAssistEnabled = params.aiAssist === 'true';

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

    // Get bilingual label
    const getBilingualLabel = (label: string) => {
        // Map common field labels to Hindi
        const labelMap: Record<string, string> = {
            'Full Name (as per documents)': 'पूरा नाम (दस्तावेज़ों के अनुसार)',
            'Gender': 'लिंग',
            'Date of Birth (DD/MM/YYYY)': 'जन्म तिथि (DD/MM/YYYY)',
            'Age (in years)': 'उम्र (वर्षों में)',
            'Date of Birth is': 'जन्म तिथि',
            'Father/Mother/Spouse/Guardian Name': 'पिता/माता/पति/अभिभावक का नाम',
            'House No / Building / Apartment': 'मकान नं / भवन / अपार्टमेंट',
            'Street / Road / Lane': 'गली / सड़क / लेन',
            'Landmark': 'लैंडमार्क',
            'Area / Locality / Sector': 'क्षेत्र / इलाका / सेक्टर',
            'Village / Town / City': 'गांव / कस्बा / शहर',
            'Post Office': 'डाकघर',
            'District': 'जिला',
            'Sub-District / Tehsil': 'उप-जिला / तहसील',
            'State': 'राज्य',
            'PIN Code': 'पिन कोड',
            'Mobile Number': 'मोबाइल नंबर',
            'Email ID (Optional)': 'ईमेल आईडी (वैकल्पिक)',
            'Proof of Identity Document': 'पहचान प्रमाण दस्तावेज़',
            'Proof of Address Document': 'पता प्रमाण दस्तावेज़',
            'Date of Birth Proof Document': 'जन्म तिथि प्रमाण दस्तावेज़',
            'Proof of Relationship Document (if any)': 'संबंध प्रमाण दस्तावेज़ (यदि कोई हो)',
            'Allow UIDAI to share your info with agencies?': 'UIDAI को आपकी जानकारी एजेंसियों से साझा करने की अनुमति?',
            'Link Aadhaar with your bank account?': 'आधार को अपने बैंक खाते से लिंक करें?',
            'Bank Name (if linking)': 'बैंक का नाम (यदि लिंक कर रहे हैं)',
            'Pre-Enrolment ID (if any)': 'पूर्व-नामांकन आईडी (यदि कोई हो)',
            "Parent/Guardian/Spouse Full Name": 'माता-पिता/अभिभावक/पति/पत्नी का पूरा नाम',
            "Their Aadhaar Number (if known)": 'उनका आधार नंबर (यदि पता हो)',
        };

        const hindiLabel = labelMap[label] || label;
        return { hi: hindiLabel, en: label };
    };

    // Auto-format input based on field type
    const formatInput = (value: string, fieldId: string): string => {
        if (fieldId.includes('name') || fieldId === 'care_of') {
            return formatName(value);
        }
        if (fieldId === 'date_of_birth' || fieldId.includes('date')) {
            return formatDate(value);
        }
        if (fieldId === 'mobile') {
            return formatMobile(value);
        }
        if (fieldId === 'pincode') {
            return value.replace(/\D/g, '').slice(0, 6);
        }
        return value;
    };

    const handleInputChange = (value: string) => {
        if (!currentField) return;

        // Auto-format the input
        const formattedValue = formatInput(value, currentField.id);
        setFormData({ ...formData, [currentField.id]: formattedValue });

        // Validate in real-time
        const validator = getValidator(currentField.id);
        const result = validator(formattedValue);

        if (!result.isValid && result.error) {
            setValidationError(result.error);
        } else {
            setValidationError(null);
        }
    };

    const handleNext = () => {
        // Check if required field is empty
        if (currentField?.required && !formData[currentField.id]?.trim()) {
            setValidationError(translations.validation.fieldRequired);
            return;
        }

        // Validate current field
        if (currentField) {
            const validator = getValidator(currentField.id);
            const result = validator(formData[currentField.id] || '');

            if (!result.isValid && result.error) {
                setValidationError(result.error);
                return;
            }
        }

        setValidationError(null);

        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleGenerate();
        }
    };

    const handleBack = () => {
        setValidationError(null);
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const handleSelectOption = (option: string) => {
        if (currentField) {
            setFormData({ ...formData, [currentField.id]: option });
            setValidationError(null);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            let finalFormData = formData;

            // Process with AI if enabled
            if (aiAssistEnabled) {
                setIsProcessingAI(true);
                const { processFormDataWithAI } = await import('@/services/aiAssist');
                finalFormData = await processFormDataWithAI(formData, true);
                setIsProcessingAI(false);
            }

            // Calculate readiness score
            const { score } = calculateReadinessScore(finalFormData, fields);

            router.replace({
                pathname: '/result',
                params: {
                    formType: formType,
                    formName: formName,
                    formData: JSON.stringify(finalFormData),
                    fields: JSON.stringify(fields),
                    readinessScore: score.toString(),
                    aiAssisted: aiAssistEnabled ? 'true' : 'false',
                },
            });
        } catch (error) {
            console.error('Error generating form:', error);
            setIsGenerating(false);
            setIsProcessingAI(false);
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === 'hi' ? 'en' : 'hi');
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

    const bilingualLabel = getBilingualLabel(currentField?.label || '');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header with Language Toggle */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <IconSymbol name="chevron.left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                            {translations.question[language]} {currentStep + 1} / {totalSteps}
                        </Text>
                    </View>
                    {/* Language Toggle */}
                    <TouchableOpacity
                        onPress={toggleLanguage}
                        style={[styles.langToggle, { backgroundColor: colors.accentLight }]}
                    >
                        <Text style={[styles.langToggleText, { color: colors.accent }]}>
                            {language === 'hi' ? 'EN' : 'हिं'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                        <View
                            style={[
                                styles.progressFill,
                                { backgroundColor: colors.accent, width: `${progress}%` }
                            ]}
                        />
                    </View>
                </View>

                {/* AI Assist Indicator */}
                {aiAssistEnabled && (
                    <View style={[styles.aiIndicator, { backgroundColor: '#C6F6D5' }]}>
                        <Text style={styles.aiIndicatorIcon}>🤖</Text>
                        <Text style={[styles.aiIndicatorText, { color: '#276749' }]}>
                            {language === 'en' ? 'AI Assist ON' : 'AI सहायता चालू'}
                        </Text>
                        {isProcessingAI && (
                            <ActivityIndicator size="small" color="#276749" style={{ marginLeft: 8 }} />
                        )}
                    </View>
                )}

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Current Field Card */}
                    <Card style={styles.fieldCard}>
                        {/* Bilingual Label */}
                        <View style={styles.labelContainer}>
                            <Text style={[styles.labelEnglish, { color: colors.text }]}>
                                {bilingualLabel.en}
                            </Text>
                            <Text style={[styles.labelHindi, { color: colors.textSecondary }]}>
                                {bilingualLabel.hi}
                            </Text>
                            {currentField?.required ? (
                                <View style={[styles.requiredBadge, { backgroundColor: colors.errorLight }]}>
                                    <Text style={[styles.requiredText, { color: colors.error }]}>
                                        आवश्यक / Required
                                    </Text>
                                </View>
                            ) : (
                                <View style={[styles.optionalBadge, { backgroundColor: colors.border }]}>
                                    <Text style={[styles.optionalText, { color: colors.textMuted }]}>
                                        वैकल्पिक / Optional
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Input or Options */}
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
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        borderColor: validationError ? colors.error : colors.border,
                                        backgroundColor: colors.surface,
                                        color: colors.text,
                                    }
                                ]}
                                value={formData[currentField?.id || ''] || ''}
                                onChangeText={handleInputChange}
                                placeholder={currentField?.placeholder}
                                placeholderTextColor={colors.textMuted}
                                keyboardType={
                                    currentField?.id === 'mobile' || currentField?.id === 'pincode' || currentField?.id === 'age'
                                        ? 'numeric'
                                        : 'default'
                                }
                                autoCapitalize={
                                    currentField?.id.includes('name') || currentField?.id === 'care_of'
                                        ? 'characters'
                                        : 'sentences'
                                }
                                autoFocus
                            />
                        )}

                        {/* Validation Error */}
                        {validationError && (
                            <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
                                <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.error} />
                                <View style={styles.errorTextContainer}>
                                    <Text style={[styles.errorTextEnglish, { color: colors.error }]}>
                                        {validationError.en}
                                    </Text>
                                    <Text style={[styles.errorTextHindi, { color: colors.error }]}>
                                        {validationError.hi}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Quick Tip */}
                        {currentField?.placeholder && !validationError && (
                            <View style={[styles.tipContainer, { backgroundColor: colors.primaryLight }]}>
                                <IconSymbol name="lightbulb.fill" size={16} color={colors.primary} />
                                <Text style={[styles.tipText, { color: colors.primary }]}>
                                    उदाहरण / Example: {currentField.placeholder}
                                </Text>
                            </View>
                        )}
                    </Card>

                    {/* Capital Letters Warning for Name Fields */}
                    {(currentField?.id.includes('name') || currentField?.id === 'care_of') && (
                        <View style={[styles.warningBanner, { backgroundColor: '#FFF3CD', borderColor: '#FFE69C' }]}>
                            <Text style={styles.warningIcon}>⚠️</Text>
                            <View>
                                <Text style={[styles.warningTextEnglish, { color: '#856404' }]}>
                                    Use CAPITAL LETTERS only
                                </Text>
                                <Text style={[styles.warningTextHindi, { color: '#856404' }]}>
                                    केवल बड़े अक्षर (CAPITAL LETTERS) लिखें
                                </Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Actions */}
                <View style={[styles.bottomActions, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
                    {/* Skip button for optional fields */}
                    {!currentField?.required && currentStep < totalSteps - 1 && (
                        <TouchableOpacity
                            onPress={() => {
                                setValidationError(null);
                                setCurrentStep(currentStep + 1);
                            }}
                            style={styles.skipButton}
                        >
                            <Text style={[styles.skipText, { color: colors.textSecondary }]}>
                                छोड़ें / Skip →
                            </Text>
                        </TouchableOpacity>
                    )}

                    <Button
                        title={currentStep === totalSteps - 1
                            ? (language === 'hi' ? 'फॉर्म बनाएं' : 'Generate Form')
                            : (language === 'hi' ? 'अगला' : 'Next')
                        }
                        onPress={handleNext}
                        loading={isGenerating}
                        fullWidth
                        size="lg"
                        disabled={!!validationError}
                        icon={
                            !isGenerating && (
                                <IconSymbol
                                    name={currentStep === totalSteps - 1 ? 'checkmark.circle.fill' : 'arrow.right'}
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
    headerSubtitle: {
        fontSize: FontSize.md,
        fontWeight: '600',
    },
    langToggle: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
    },
    langToggleText: {
        fontSize: FontSize.sm,
        fontWeight: '700',
    },
    progressContainer: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.lg,
    },
    fieldCard: {
        padding: Spacing.lg,
    },
    labelContainer: {
        marginBottom: Spacing.lg,
    },
    labelEnglish: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        marginBottom: Spacing.xs,
    },
    labelHindi: {
        fontSize: FontSize.md,
        marginBottom: Spacing.sm,
    },
    requiredBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
    },
    requiredText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
    },
    optionalBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
    },
    optionalText: {
        fontSize: FontSize.xs,
    },
    input: {
        borderWidth: 2,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        fontSize: FontSize.lg,
        fontWeight: '600',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    optionButton: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        minWidth: 100,
        alignItems: 'center',
    },
    optionText: {
        fontSize: FontSize.md,
        fontWeight: '600',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.md,
        gap: Spacing.sm,
    },
    errorTextContainer: {
        flex: 1,
    },
    errorTextEnglish: {
        fontSize: FontSize.sm,
        fontWeight: '600',
    },
    errorTextHindi: {
        fontSize: FontSize.xs,
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
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.md,
        borderWidth: 1,
        gap: Spacing.sm,
    },
    warningIcon: {
        fontSize: 20,
    },
    warningTextHindi: {
        fontSize: FontSize.sm,
        fontWeight: '600',
    },
    warningTextEnglish: {
        fontSize: FontSize.xs,
    },
    bottomActions: {
        padding: Spacing.lg,
        borderTopWidth: 1,
    },
    skipButton: {
        alignItems: 'center',
        paddingBottom: Spacing.sm,
    },
    skipText: {
        fontSize: FontSize.sm,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: FontSize.md,
    },
    aiIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
    },
    aiIndicatorIcon: {
        fontSize: 16,
        marginRight: Spacing.xs,
    },
    aiIndicatorText: {
        fontSize: FontSize.sm,
        fontWeight: '600',
    },
});

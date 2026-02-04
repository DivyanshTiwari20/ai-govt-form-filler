/**
 * Result Screen
 * Display filled form with readiness score, copy buttons, and download
 */

import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system/legacy';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getFormHTML } from '@/services/formTemplates';
import { translations } from '@/services/i18n';

const { width: screenWidth } = Dimensions.get('window');
const FORM_WIDTH = screenWidth - 32;
const FORM_HEIGHT = 950;

export default function ResultScreen() {
    const colors = Colors.light;
    const router = useRouter();
    const params = useLocalSearchParams();
    const formContainerRef = useRef<View>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const formType = params.formType as string || 'aadhaar';
    const formName = params.formName as string || 'Filled Form';
    const readinessScore = parseInt(params.readinessScore as string) || 85;

    // Parse form data and fields
    let formData: Record<string, string> = {};
    let fields: { id: string; label: string }[] = [];

    try {
        if (params.formData) {
            formData = JSON.parse(params.formData as string);
        }
        if (params.fields) {
            fields = JSON.parse(params.fields as string);
        }
    } catch (e) {
        console.error('Failed to parse params:', e);
    }

    // Generate HTML for the form
    const formHTML = getFormHTML(formType, formData, formName);

    // Get score color and message
    const getScoreColor = () => {
        if (readinessScore >= 90) return colors.success;
        if (readinessScore >= 70) return colors.warning;
        return colors.error;
    };

    const getScoreMessage = () => {
        if (readinessScore >= 90) return { hi: 'उत्कृष्ट! फॉर्म सही भरा है', en: 'Excellent! Form is properly filled' };
        if (readinessScore >= 70) return { hi: 'अच्छा है, कुछ सुधार करें', en: 'Good, minor improvements needed' };
        return { hi: 'सुधार आवश्यक है', en: 'Needs improvement' };
    };

    const copyToClipboard = async (value: string, fieldId: string) => {
        await Clipboard.setStringAsync(value);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const webViewRef = useRef<WebView>(null);
    const [pendingAction, setPendingAction] = useState<'save' | 'share' | null>(null);
    const [isFormReady, setIsFormReady] = useState(false);

    // Handle messages from WebView
    const handleWebViewMessage = useCallback(async (event: any) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);

            if (message.type === 'formReady') {
                setIsFormReady(true);
                setIsLoading(false);
            } else if (message.type === 'formCapture' && message.data) {
                // Convert base64 to file and save
                const base64Data = message.data.replace(/^data:image\/png;base64,/, '');
                const fileName = `form_${formType}_${Date.now()}.png`;
                const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

                try {
                    // Write base64 data to file using traditional API
                    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    // Use Sharing for both save and share (works without MediaLibrary permissions in Expo Go)
                    const isAvailable = await Sharing.isAvailableAsync();
                    if (isAvailable) {
                        if (pendingAction === 'save') {
                            // Show share dialog - user can save to gallery from here
                            await Sharing.shareAsync(fileUri, {
                                mimeType: 'image/png',
                                dialogTitle: 'Save Form / फॉर्म सेव करें',
                                UTI: 'public.png',
                            });
                            Alert.alert(
                                '✓ Done!',
                                'फॉर्म शेयर शीट में खुल गया। "Save to Gallery" चुनें।\nForm opened in share sheet. Choose "Save to Gallery".',
                                [{ text: 'ठीक है / OK' }]
                            );
                        } else if (pendingAction === 'share') {
                            await Sharing.shareAsync(fileUri, {
                                mimeType: 'image/png',
                                dialogTitle: `Share ${formName}`,
                            });
                        }
                    } else {
                        Alert.alert('Error', 'Sharing is not available on this device');
                    }
                } catch (fileError: any) {
                    console.error('File operation error:', fileError);
                    Alert.alert(
                        'Error / त्रुटि',
                        `फाइल ऑपरेशन विफल।\nFile operation failed.\n${fileError.message || ''}`,
                        [{ text: 'OK' }]
                    );
                }

                setPendingAction(null);
                setIsSaving(false);
                setIsSharing(false);
            } else if (message.type === 'captureError') {
                console.error('WebView capture error:', message.message);
                Alert.alert(
                    'Error / त्रुटि',
                    'फॉर्म कैप्चर नहीं हो सका।\nCould not capture form.',
                    [{ text: 'OK' }]
                );
                setPendingAction(null);
                setIsSaving(false);
                setIsSharing(false);
            }
        } catch (error) {
            console.error('Error handling WebView message:', error);
        }
    }, [formType, formName, pendingAction]);

    // Trigger form capture in WebView
    const triggerFormCapture = useCallback((action: 'save' | 'share') => {
        if (webViewRef.current) {
            setPendingAction(action);
            webViewRef.current.injectJavaScript('captureForm(); true;');
        }
    }, []);

    const handleSaveToGallery = async () => {
        setIsSaving(true);
        try {
            // First check if we're on the form view
            if (showDetails) {
                Alert.alert(
                    'फॉर्म देखें / View Form',
                    'कृपया पहले "Form / फॉर्म देखें" पर क्लिक करें\nPlease switch to "Form" view first to save.',
                    [{ text: 'ठीक है / OK' }]
                );
                setIsSaving(false);
                return;
            }

            // Trigger WebView capture (no permission needed - using Sharing instead of MediaLibrary)
            triggerFormCapture('save');
        } catch (error: any) {
            console.error('Save error:', error);
            Alert.alert(
                'Error / त्रुटि',
                `सेव नहीं हो सका।\nCould not save.\n${error.message || ''}`,
                [{ text: 'OK' }]
            );
            setIsSaving(false);
        }
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            // First check if we're on the form view
            if (showDetails) {
                Alert.alert(
                    'फॉर्म देखें / View Form',
                    'कृपया पहले "Form / फॉर्म देखें" पर क्लिक करें\nPlease switch to "Form" view first to share.',
                    [{ text: 'ठीक है / OK' }]
                );
                setIsSharing(false);
                return;
            }

            // Trigger WebView capture for sharing
            triggerFormCapture('share');
        } catch (error: any) {
            console.error('Share error:', error);
            Alert.alert(
                'Error / त्रुटि',
                `शेयर नहीं हो सका। पुन: प्रयास करें।\nFailed to share. Please try again.\n${error.message || ''}`,
                [{ text: 'OK' }]
            );
            setIsSharing(false);
        }
    };

    const handleNewForm = () => {
        router.replace('/(tabs)');
    };

    const scoreMessage = getScoreMessage();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleNewForm} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Your Filled Form
                </Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
            >
                {/* Form Readiness Score */}
                <Card style={[styles.scoreCard, { borderColor: getScoreColor() }]}>
                    <View style={styles.scoreHeader}>
                        <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
                            Form Readiness Score / फॉर्म तैयारी स्कोर
                        </Text>
                        <View style={[styles.scoreBadge, { backgroundColor: getScoreColor() }]}>
                            <Text style={styles.scoreValue}>{readinessScore}%</Text>
                        </View>
                    </View>
                    <Text style={[styles.scoreMessageEn, { color: getScoreColor() }]}>
                        {scoreMessage.en}
                    </Text>
                    <Text style={[styles.scoreMessageHi, { color: colors.textSecondary }]}>
                        {scoreMessage.hi}
                    </Text>
                </Card>

                {/* Warning Banner */}
                <View style={[styles.warningBanner, { backgroundColor: '#FFF3CD', borderColor: '#FFE69C' }]}>
                    <Text style={styles.warningIcon}>⚠️</Text>
                    <View style={styles.warningTextContainer}>
                        <Text style={[styles.warningTextEn, { color: '#856404' }]}>
                            {translations.copyWarning.en}
                        </Text>
                        <Text style={[styles.warningTextHi, { color: '#856404' }]}>
                            {translations.copyWarning.hi}
                        </Text>
                    </View>
                </View>

                {/* Toggle: Show Form Preview / Show Fields */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            !showDetails && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => setShowDetails(false)}
                    >
                        <Text style={[
                            styles.toggleText,
                            { color: !showDetails ? '#FFFFFF' : colors.text }
                        ]}>
                            Form / फॉर्म देखें
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            showDetails && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => setShowDetails(true)}
                    >
                        <Text style={[
                            styles.toggleText,
                            { color: showDetails ? '#FFFFFF' : colors.text }
                        ]}>
                            Details / जानकारी
                        </Text>
                    </TouchableOpacity>
                </View>

                {showDetails ? (
                    /* Field Details with Copy Buttons */
                    <View style={styles.fieldsContainer}>
                        {fields.map((field) => {
                            const value = formData[field.id];
                            if (!value) return null;

                            return (
                                <TouchableOpacity
                                    key={field.id}
                                    style={[styles.fieldRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                    onPress={() => copyToClipboard(value, field.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.fieldInfo}>
                                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                                            {field.label}
                                        </Text>
                                        <Text style={[styles.fieldValue, { color: colors.text }]}>
                                            {value.toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.copyButton,
                                        { backgroundColor: copiedField === field.id ? colors.successLight : colors.primaryLight }
                                    ]}>
                                        {copiedField === field.id ? (
                                            <Text style={[styles.copyText, { color: colors.success }]}>✓</Text>
                                        ) : (
                                            <IconSymbol name="doc.on.doc" size={16} color={colors.primary} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Common Mistakes Card */}
                        <Card style={styles.infoCard}>
                            <Text style={[styles.infoTitle, { color: colors.error }]}>
                                {translations.commonMistakes.title.en}
                            </Text>
                            <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
                                {translations.commonMistakes.title.hi}
                            </Text>
                            {translations.commonMistakes.items.map((item, index) => (
                                <Text key={index} style={[styles.infoItem, { color: colors.text }]}>
                                    {item.hi}
                                </Text>
                            ))}
                        </Card>

                        {/* Why Forms Get Rejected */}
                        <Card style={styles.infoCard}>
                            <Text style={[styles.infoTitle, { color: colors.warning }]}>
                                {translations.whyRejected.title.hi}
                            </Text>
                            <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
                                {translations.whyRejected.title.en}
                            </Text>
                            {translations.whyRejected.reasons.map((reason, index) => (
                                <View key={index} style={styles.reasonRow}>
                                    <Text style={styles.reasonIcon}>•</Text>
                                    <View>
                                        <Text style={[styles.reasonHi, { color: colors.text }]}>{reason.hi}</Text>
                                        <Text style={[styles.reasonEn, { color: colors.textSecondary }]}>{reason.en}</Text>
                                    </View>
                                </View>
                            ))}
                        </Card>
                    </View>
                ) : (
                    /* Form Preview */
                    <View style={styles.formWrapper}>
                        {isLoading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                                    फॉर्म बना रहे हैं...
                                </Text>
                            </View>
                        )}

                        <View
                            ref={formContainerRef}
                            style={styles.viewShot}
                            collapsable={false}
                            renderToHardwareTextureAndroid={true}
                        >
                            <WebView
                                ref={webViewRef}
                                source={{ html: formHTML }}
                                style={styles.webview}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                onLoadEnd={() => setIsLoading(false)}
                                onMessage={handleWebViewMessage}
                                originWhitelist={['*']}
                                scalesPageToFit={false}
                                javaScriptEnabled={true}
                                androidLayerType="hardware"
                            />
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={[styles.actions, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <Button
                    title="💾  गैलरी में सेव करें / Save to Gallery"
                    onPress={handleSaveToGallery}
                    loading={isSaving}
                    fullWidth
                    size="lg"
                />

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.secondaryButton, { borderColor: colors.accent }]}
                        onPress={handleShare}
                        disabled={isSharing}
                    >
                        {isSharing ? (
                            <ActivityIndicator size="small" color={colors.accent} />
                        ) : (
                            <>
                                <IconSymbol name="square.and.arrow.up" size={18} color={colors.accent} />
                                <Text style={[styles.secondaryButtonText, { color: colors.accent }]}>
                                    शेयर करें
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, { borderColor: colors.textSecondary }]}
                        onPress={handleNewForm}
                    >
                        <IconSymbol name="plus" size={18} color={colors.textSecondary} />
                        <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                            नया फॉर्म
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    backButton: {
        padding: Spacing.sm,
    },
    headerTitle: {
        flex: 1,
        fontSize: FontSize.lg,
        fontWeight: '700',
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    scoreCard: {
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 2,
    },
    scoreHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    scoreLabel: {
        fontSize: FontSize.sm,
    },
    scoreBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.md,
    },
    scoreValue: {
        color: '#FFFFFF',
        fontSize: FontSize.lg,
        fontWeight: '700',
    },
    scoreMessageEn: {
        fontSize: FontSize.md,
        fontWeight: '600',
    },
    scoreMessageHi: {
        fontSize: FontSize.sm,
    },
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        gap: Spacing.sm,
    },
    warningIcon: {
        fontSize: 24,
    },
    warningTextContainer: {
        flex: 1,
    },
    warningTextEn: {
        fontSize: FontSize.sm,
        fontWeight: '600',
    },
    warningTextHi: {
        fontSize: FontSize.xs,
    },
    toggleContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        backgroundColor: '#E2E8F0',
    },
    toggleText: {
        fontSize: FontSize.sm,
        fontWeight: '600',
    },
    fieldsContainer: {
        gap: Spacing.sm,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
    },
    fieldInfo: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: FontSize.xs,
        marginBottom: 2,
    },
    fieldValue: {
        fontSize: FontSize.md,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    copyButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    copyText: {
        fontSize: FontSize.lg,
        fontWeight: '700',
    },
    infoCard: {
        padding: Spacing.md,
        marginTop: Spacing.md,
    },
    infoTitle: {
        fontSize: FontSize.md,
        fontWeight: '700',
    },
    infoSubtitle: {
        fontSize: FontSize.sm,
        marginBottom: Spacing.sm,
    },
    infoItem: {
        fontSize: FontSize.sm,
        marginTop: Spacing.xs,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    reasonRow: {
        flexDirection: 'row',
        marginTop: Spacing.xs,
        gap: Spacing.xs,
    },
    reasonIcon: {
        fontSize: FontSize.md,
    },
    reasonHi: {
        fontSize: FontSize.sm,
    },
    reasonEn: {
        fontSize: FontSize.xs,
    },
    formWrapper: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
        backgroundColor: 'rgba(255,255,255,0.95)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        borderRadius: BorderRadius.lg,
    },
    loadingText: {
        marginTop: Spacing.md,
        fontSize: FontSize.md,
    },
    viewShot: {
        width: FORM_WIDTH,
        height: FORM_HEIGHT,
        backgroundColor: '#FFFFFF',
    },
    webview: {
        width: FORM_WIDTH,
        height: FORM_HEIGHT,
        backgroundColor: '#FFFFFF',
    },
    actions: {
        padding: Spacing.md,
        paddingBottom: Platform.OS === 'android' ? Spacing.lg : Spacing.md,
        borderTopWidth: 1,
        gap: Spacing.sm,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
    },
    secondaryButtonText: {
        fontSize: FontSize.sm,
        fontWeight: '600',
    },
});

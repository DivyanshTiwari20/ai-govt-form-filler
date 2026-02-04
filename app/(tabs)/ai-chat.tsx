/**
 * AI Chat Tab
 * Chat interface for AI assistance with form filling
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RiChatAiLine, RiRobot2Fill, RiSendPlaneFill } from '@/components/ui/ReactIcons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const QUICK_QUESTIONS = [
    { hi: 'आधार कार्ड कैसे बनवाएं?', en: 'How to apply for Aadhaar?' },
    { hi: 'PAN कार्ड के लिए क्या डॉक्युमेंट्स?', en: 'Documents for PAN card?' },
    { hi: 'पासपोर्ट अप्लाई कैसे करें?', en: 'How to apply for passport?' },
    { hi: 'वोटर ID में नाम कैसे सुधारें?', en: 'How to correct name in Voter ID?' },
];

export default function AIChatScreen() {
    const colors = Colors.light;
    const scrollViewRef = useRef<ScrollView>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '🙏 नमस्ते! मैं आपका AI सहायक हूं।\n\nI can help you with:\n• Aadhaar, PAN, Passport forms\n• Voter ID, Driving License\n• Any government form questions\n• Documents required\n• Common mistakes to avoid\n\nकिसी भी भाषा में पूछें - Hindi, English या Hinglish!',
            isUser: false,
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState<'hi' | 'en'>('en');

    // Scroll to bottom when messages change
    useEffect(() => {
        const timer = setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    const getOfflineResponse = (question: string): string => {
        const q = question.toLowerCase();

        // Aadhaar related
        if (q.includes('aadhaar') || q.includes('आधार') || q.includes('aadhar')) {
            return '📝 आधार कार्ड के लिए:\n\n✅ Required Documents:\n• Identity Proof (Passport, Voter ID, PAN)\n• Address Proof (Utility Bill, Bank Statement)\n• DOB Proof (Birth Certificate)\n\n📍 Visit nearest Aadhaar Seva Kendra\n💰 Free enrollment, ₹50 for updates\n\nTip: Use CAPITAL LETTERS in form!';
        }

        // PAN related
        if (q.includes('pan') || q.includes('पैन') || q.includes('पेन')) {
            return '📄 PAN Card के लिए:\n\n✅ Documents Required:\n• ID Proof (Aadhaar, Passport, Voter ID)\n• Address Proof\n• DOB Proof\n• 2 Passport Photos\n\n🌐 Apply at: incometax.gov.in\n💰 Fee: ₹107 (Indian), ₹1,020 (Foreign)\n\nProcessing: 15-20 days';
        }

        // Passport related
        if (q.includes('passport') || q.includes('पासपोर्ट')) {
            return '🛂 Passport के लिए:\n\n✅ Documents:\n• Aadhaar Card\n• PAN Card (optional)\n• Address Proof\n• DOB Proof\n\n📍 Apply: passportindia.gov.in\n💰 Normal: ₹1,500 | Tatkal: ₹3,500\n\nTip: Book appointment online first!';
        }

        // Voter ID related
        if (q.includes('voter') || q.includes('वोटर') || q.includes('election') || q.includes('चुनाव')) {
            return '🗳️ Voter ID Card के लिए:\n\n✅ Documents:\n• Age Proof (10th Certificate, Birth Certificate)\n• Address Proof\n• Passport Photo\n\n🌐 Apply: voters.eci.gov.in\n📱 Or use "Voter Helpline" app\n\n✅ Free of cost!';
        }

        // Driving License related
        if (q.includes('driving') || q.includes('license') || q.includes('लाइसेंस') || q.includes('dl')) {
            return '🚗 Driving License के लिए:\n\n✅ Documents:\n• Aadhaar Card\n• Address Proof\n• Age Proof\n• Medical Certificate (for transport)\n\n📍 Apply: parivahan.gov.in\n💰 Fee: ₹200-₹1,000\n\nFirst get Learner License, then DL after 30 days!';
        }

        // Documents related
        if (q.includes('document') || q.includes('दस्तावेज़') || q.includes('proof') || q.includes('कागज')) {
            return '📄 Common Documents for Govt Forms:\n\n🆔 ID Proof:\n• Aadhaar, PAN, Passport, Voter ID\n\n🏠 Address Proof:\n• Utility Bills, Bank Statement, Aadhaar\n\n📅 DOB Proof:\n• Birth Certificate, 10th Marksheet, Passport';
        }

        // General / Default
        return '🙏 मैं इन सब में मदद कर सकता हूं:\n\n• Aadhaar Card\n• PAN Card\n• Passport\n• Voter ID\n• Driving License\n• Other govt forms\n\nAsk specific questions!\nकोई भी सवाल पूछें - Hindi या English में!';
    };

    const getAIResponse = async (question: string): Promise<string> => {
        const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

        if (!API_KEY) {
            console.log('No API key, using offline response');
            return getOfflineResponse(question);
        }

        try {
            const q = question.toLowerCase();
            // Check if user wants more details
            const wantsDetail = q.includes('detail') || q.includes('विस्तार') ||
                q.includes('explain') || q.includes('more') ||
                q.includes('step by step') || q.includes('procedure') ||
                q.includes('process') || q.includes('how to');

            const systemPrompt = wantsDetail
                ? `You are a helpful AI assistant for Indian government forms. Give a detailed step-by-step answer with required documents, fees, websites, and tips.
                
Respond in the SAME LANGUAGE the user asks in (Hindi/English/Hinglish).
Keep response 150-200 words. Use emojis for better readability.

User Question: "${question}"

Give a complete, helpful response:`

                : `You are a helpful AI assistant for Indian government forms (Aadhaar, PAN, Passport, Voter ID, etc.).

Give a SHORT and SIMPLE answer (50-80 words maximum).
Respond in the SAME LANGUAGE the user asks in (Hindi/English/Hinglish).
Use 1-2 emojis only.

User Question: "${question}"

Give a brief, friendly response:`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: systemPrompt
                            }]
                        }],
                        generationConfig: {
                            maxOutputTokens: wantsDetail ? 400 : 150,
                            temperature: 0.7
                        }
                    })
                }
            );

            if (response.ok) {
                const data = await response.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                if (text) {
                    return text;
                }
            } else {
                console.log('API response not ok:', response.status);
            }
        } catch (error) {
            console.log('AI API error:', error);
        }

        return getOfflineResponse(question);
    };

    const sendMessage = async (text: string) => {
        const trimmedText = text.trim();
        if (!trimmedText || isLoading) return;

        // Clear input immediately
        setInputText('');
        Keyboard.dismiss();

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: trimmedText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Get AI response
            const response = await getAIResponse(trimmedText);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.log('Send message error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'क्षमा करें, कुछ गलत हो गया।\nSorry, please try again.',
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickQuestion = (question: { hi: string; en: string }) => {
        const text = language === 'hi' ? question.hi : question.en;
        sendMessage(text);
    };

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessage(inputText);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* Header */}
                <View style={[styles.header, { backgroundColor: '#2B6CB0' }]}>
                    <View style={styles.headerLeft}>
                        <View>
                            <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
                                AI Assistant
                            </Text>
                            <Text style={[styles.headerSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
                                AI सहायक
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
                        style={[styles.langToggle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                    >
                        <Text style={[styles.langToggleText, { color: '#FFFFFF' }]}>
                            {language === 'en' ? 'हिं' : 'EN'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={[
                                styles.messageRow,
                                message.isUser ? styles.userRow : styles.aiRow
                            ]}
                        >
                            {!message.isUser && (
                                <View style={[styles.avatarBubble, { backgroundColor: '#C6F6D5' }]}>
                                    <RiRobot2Fill size={18} color="#276749" />
                                </View>
                            )}
                            <View
                                style={[
                                    styles.messageBubble,
                                    message.isUser
                                        ? [styles.userBubble, { backgroundColor: colors.primary }]
                                        : [styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }]
                                ]}
                            >
                                <Text style={[
                                    styles.messageText,
                                    { color: message.isUser ? '#FFFFFF' : colors.text }
                                ]}>
                                    {message.text}
                                </Text>
                            </View>
                        </View>
                    ))}

                    {isLoading && (
                        <View style={[styles.messageRow, styles.aiRow]}>
                            <View style={[styles.avatarBubble, { backgroundColor: '#C6F6D5' }]}>
                                <RiRobot2Fill size={18} color="#276749" />
                            </View>
                            <View style={[styles.messageBubble, styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <View style={styles.typingContainer}>
                                    <ActivityIndicator size="small" color={colors.primary} />
                                    <Text style={[styles.typingText, { color: colors.textSecondary }]}>
                                        सोच रहा हूं...
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Quick Questions - Show only at start */}
                {messages.length <= 2 && !isLoading && (
                    <View style={[styles.quickQuestions, { borderTopColor: colors.border }]}>
                        <Text style={[styles.quickTitle, { color: colors.textSecondary }]}>
                            Quick questions / जल्दी पूछें:
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.quickButtonsContainer}
                        >
                            {QUICK_QUESTIONS.map((q, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.quickButton, { backgroundColor: colors.accentLight, borderColor: colors.accent }]}
                                    onPress={() => handleQuickQuestion(q)}
                                >
                                    <Text style={[styles.quickButtonText, { color: colors.accent }]}>
                                        {language === 'hi' ? q.hi : q.en}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Input Area */}
                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: colors.background,
                            color: colors.text,
                            borderColor: colors.border
                        }]}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={language === 'hi' ? 'अपना सवाल लिखें...' : 'Type your question...'}
                        placeholderTextColor={colors.textMuted}
                        multiline
                        maxLength={500}
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            { backgroundColor: inputText.trim() && !isLoading ? colors.accent : colors.border }
                        ]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || isLoading}
                        activeOpacity={0.7}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <RiSendPlaneFill size={20} color="#FFFFFF" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    headerText: {
        flex: 1,
    },
    headerTitle: {
        fontSize: FontSize.xl,
        fontWeight: '700',
    },
    headerSubtitle: {
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
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: Spacing.md,
        paddingBottom: Spacing.lg,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
        alignItems: 'flex-end',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    aiRow: {
        justifyContent: 'flex-start',
    },
    avatarBubble: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.xs,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    userBubble: {
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        borderBottomLeftRadius: 4,
        borderWidth: 1,
    },
    messageText: {
        fontSize: FontSize.md,
        lineHeight: 22,
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    typingText: {
        fontSize: FontSize.sm,
    },
    quickQuestions: {
        padding: Spacing.md,
        borderTopWidth: 1,
    },
    quickTitle: {
        fontSize: FontSize.xs,
        marginBottom: Spacing.sm,
    },
    quickButtonsContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        paddingRight: Spacing.md,
    },
    quickButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
    },
    quickButtonText: {
        fontSize: FontSize.sm,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: Spacing.md,
        borderTopWidth: 1,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 100,
        borderWidth: 1,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        paddingTop: Platform.OS === 'ios' ? Spacing.sm : Spacing.sm,
        fontSize: FontSize.md,
        textAlignVertical: 'center',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

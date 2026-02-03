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
    { hi: 'आधार फॉर्म कैसे भरें?', en: 'How to fill Aadhaar form?' },
    { hi: 'कौन से दस्तावेज़ चाहिए?', en: 'What documents needed?' },
    { hi: 'फॉर्म रिजेक्ट क्यों होता है?', en: 'Why forms get rejected?' },
    { hi: 'नाम कैसे लिखें?', en: 'How to write name?' },
];

export default function AIChatScreen() {
    const colors = Colors.light;
    const scrollViewRef = useRef<ScrollView>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I can help you with:\n• How to fill Aadhaar form\n• Required documents\n• Common mistakes\n• Name/address formatting\n\nनमस्ते! 🙏 मैं आपका AI सहायक हूं।',
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

        if (q.includes('fill') || q.includes('भर') || q.includes('kaise') || q.includes('कैसे')) {
            return '📝 आधार फॉर्म भरने के टिप्स:\n\n1. सभी नाम CAPITAL LETTERS में लिखें\n2. जन्म तिथि DD/MM/YYYY में\n3. पता पूरा लिखें\n4. मोबाइल 10 अंकों का\n\nTips:\n• Use CAPITAL LETTERS\n• Date: DD/MM/YYYY\n• Complete address\n• 10 digit mobile';
        }

        if (q.includes('document') || q.includes('दस्तावेज़') || q.includes('proof') || q.includes('कागज')) {
            return '📄 आवश्यक दस्तावेज़:\n\nपहचान प्रमाण:\n• पासपोर्ट, वोटर ID, PAN\n\nपता प्रमाण:\n• बिजली बिल, बैंक स्टेटमेंट\n\nजन्म तिथि:\n• जन्म प्रमाण पत्र, स्कूल सर्टिफिकेट';
        }

        if (q.includes('reject') || q.includes('रिजेक्ट') || q.includes('mistake') || q.includes('गलती')) {
            return '❌ फॉर्म रिजेक्ट होने के कारण:\n\n1. छोटे अक्षरों में नाम\n2. अधूरा पता\n3. गलत date format\n4. Initials का use\n\n✅ सही तरीका:\n• CAPITAL LETTERS\n• पूरा नाम (RAMESH KUMAR)\n• दस्तावेज़ से मिलान करें';
        }

        if (q.includes('name') || q.includes('नाम') || q.includes('naam')) {
            return '✍️ नाम लिखने का तरीका:\n\n❌ गलत:\n• r. kumar\n• ramesh kumar\n\n✅ सही:\n• RAMESH KUMAR SINGH\n\nयाद रखें:\n• CAPITAL में लिखें\n• पूरा नाम, initials नहीं\n• दस्तावेज़ से match करें';
        }

        if (q.includes('address') || q.includes('पता') || q.includes('pata')) {
            return '🏠 पता लिखने का तरीका:\n\n✅ सही format:\nHOUSE NO 123\nSTREET NAME\nAREA/LOCALITY\nCITY - PINCODE\nSTATE\n\nयाद रखें:\n• CAPITAL LETTERS में\n• पूरा पता लिखें\n• PIN code 6 अंकों का';
        }

        return '🙏 मैं आपकी मदद के लिए हाज़िर हूं!\n\nआप पूछ सकते हैं:\n• फॉर्म कैसे भरें\n• दस्तावेज़ क्या चाहिए\n• गलतियाँ कैसे बचें\n• नाम/पता कैसे लिखें\n\nAsk me anything about Aadhaar forms!';
    };

    const getAIResponse = async (question: string): Promise<string> => {
        const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

        if (!API_KEY) {
            console.log('No API key, using offline response');
            return getOfflineResponse(question);
        }

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `You are a helpful assistant for filling Indian Aadhaar forms.
Answer in Hinglish (Hindi + English mix).
Keep answers short and practical (max 150 words).
Focus on: correct formatting, documents, common mistakes, tips.

Question: "${question}"

Give a helpful, friendly response.`
                            }]
                        }],
                        generationConfig: {
                            maxOutputTokens: 250,
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

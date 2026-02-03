/**
 * Settings Screen
 * App configuration and information
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

export default function SettingsScreen() {
    const colors = Colors.light; // Force light mode

    const handleClearCache = () => {
        Alert.alert(
            'Clear Cache',
            'This will remove all cached form images. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear', style: 'destructive', onPress: () => {
                        // TODO: Implement cache clearing
                        Alert.alert('Done', 'Cache cleared successfully');
                    }
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
                    </View>

                    {/* App Info Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            ABOUT
                        </Text>
                        <Card padding="none">
                            <SettingsItem
                                icon="info.circle.fill"
                                title="App Version"
                                value="1.0.0"
                                colors={colors}
                            />
                            <Divider colors={colors} />
                            <SettingsItem
                                icon="cpu.fill"
                                title="Powered by"
                                value="Google Gemini AI"
                                colors={colors}
                            />
                        </Card>
                    </View>

                    {/* Data Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            DATA
                        </Text>
                        <Card padding="none">
                            <SettingsItem
                                icon="trash.fill"
                                title="Clear Cache"
                                colors={colors}
                                showChevron
                                onPress={handleClearCache}
                                destructive
                            />
                        </Card>
                    </View>

                    {/* Help Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            HELP
                        </Text>
                        <Card padding="none">
                            <SettingsItem
                                icon="questionmark.circle.fill"
                                title="How to Use"
                                colors={colors}
                                showChevron
                                onPress={() => Alert.alert(
                                    'How to Use',
                                    '1. Upload or take a photo of any government form\n\n2. AI will analyze and identify all fields\n\n3. Answer the questions step by step\n\n4. Get a generated image of the filled form\n\n5. Use this as a reference to fill the physical form'
                                )}
                            />
                            <Divider colors={colors} />
                            <SettingsItem
                                icon="envelope.fill"
                                title="Contact Support"
                                colors={colors}
                                showChevron
                                onPress={() => Linking.openURL('mailto:support@example.com')}
                            />
                        </Card>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.textMuted }]}>
                            Made with ❤️ for India
                        </Text>
                        <Text style={[styles.footerSubtext, { color: colors.textMuted }]}>
                            Helping citizens fill forms correctly
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

interface SettingsItemProps {
    icon: string;
    title: string;
    value?: string;
    colors: typeof Colors.light;
    showChevron?: boolean;
    onPress?: () => void;
    destructive?: boolean;
}

function SettingsItem({
    icon,
    title,
    value,
    colors,
    showChevron = false,
    onPress,
    destructive = false,
}: SettingsItemProps) {
    const content = (
        <View style={styles.settingsItem}>
            <View style={[styles.settingsIcon, { backgroundColor: destructive ? colors.error + '20' : colors.primaryLight }]}>
                <IconSymbol name={icon as any} size={20} color={destructive ? colors.error : colors.primary} />
            </View>
            <View style={styles.settingsContent}>
                <Text style={[styles.settingsTitle, { color: destructive ? colors.error : colors.text }]}>
                    {title}
                </Text>
            </View>
            {value && (
                <Text style={[styles.settingsValue, { color: colors.textMuted }]}>
                    {value}
                </Text>
            )}
            {showChevron && (
                <IconSymbol name="chevron.right" size={16} color={colors.textMuted} />
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
}

function Divider({ colors }: { colors: typeof Colors.light }) {
    return (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
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
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSize.xxl,
        fontWeight: '700',
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: FontSize.xs,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        gap: Spacing.md,
    },
    settingsIcon: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsContent: {
        flex: 1,
    },
    settingsTitle: {
        fontSize: FontSize.md,
        fontWeight: '500',
    },
    settingsValue: {
        fontSize: FontSize.sm,
    },
    divider: {
        height: 1,
        marginLeft: 60,
    },
    footer: {
        alignItems: 'center',
        marginTop: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    footerText: {
        fontSize: FontSize.sm,
    },
    footerSubtext: {
        fontSize: FontSize.xs,
        marginTop: Spacing.xs,
    },
});

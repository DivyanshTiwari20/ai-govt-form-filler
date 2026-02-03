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
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { RiInformationLine, RiMailLine, RiHistoryLine, RiArrowRightSLine } from '@/components/ui/ReactIcons';

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
            {/* Header Section */}
            <View style={[styles.header, { backgroundColor: '#2B6CB0' }]}>
                <View style={styles.headerLeft}>
                    <View>
                        <Text style={[styles.titleEnglish, { color: '#FFFFFF' }]}>
                            Settings
                        </Text>
                        <Text style={[styles.titleHindi, { color: 'rgba(255,255,255,0.8)' }]}>
                            सेटिंग्स
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>

                    {/* App Info Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            ABOUT
                        </Text>
                        <Card padding="none">
                            <SettingsItem
                                icon={RiInformationLine}
                                title="App Version"
                                value="1.0.0"
                                colors={colors}
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
                                icon={RiHistoryLine}
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
                                icon={RiMailLine}
                                title="Contact Support"
                                colors={colors}
                                showChevron
                            // onPress={() => Linking.openURL('mailto:support@example.com')}
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
    icon: React.ElementType;
    title: string;
    value?: string;
    colors: typeof Colors.light;
    showChevron?: boolean;
    onPress?: () => void;
    destructive?: boolean;
}

function SettingsItem({
    icon: Icon,
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
                <Icon size={20} color={destructive ? colors.error : colors.primary} />
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
                <RiArrowRightSLine size={16} color={colors.textMuted} />
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
    titleEnglish: {
        fontSize: FontSize.xl,
        fontWeight: '700',
    },
    titleHindi: {
        fontSize: FontSize.md,
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

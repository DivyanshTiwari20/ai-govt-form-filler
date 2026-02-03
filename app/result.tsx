/**
 * Result Screen
 * Display the generated filled form image
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Share,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

export default function ResultScreen() {
    const colors = Colors.light; // Force light mode
    const router = useRouter();
    const params = useLocalSearchParams();

    const [isSaving, setIsSaving] = useState(false);

    const imageUri = params.imageUri as string;
    const formName = params.formName as string || 'Filled Form';

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant permission to save images');
                return;
            }

            const asset = await MediaLibrary.createAssetAsync(imageUri);

            // Create or get album
            const album = await MediaLibrary.getAlbumAsync('Form Filler');
            if (album) {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            } else {
                await MediaLibrary.createAlbumAsync('Form Filler', asset, false);
            }

            Alert.alert('Saved!', 'Image saved to your gallery in "Form Filler" album');
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Failed to save image');
        } finally {
            setIsSaving(false);
        }
    };

    const handleShare = async () => {
        try {
            if (Platform.OS === 'web') {
                Alert.alert('Info', 'Sharing is not available on web');
                return;
            }

            await Share.share({
                url: imageUri,
                message: `My filled ${formName}`,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const handleNewForm = () => {
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleNewForm} style={styles.backButton}>
                    <IconSymbol name="xmark" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Form Ready!
                </Text>
                <View style={styles.headerRight} />
            </View>

            {/* Success Banner */}
            <View style={[styles.successBanner, { backgroundColor: colors.success + '15' }]}>
                <View style={[styles.successIcon, { backgroundColor: colors.success }]}>
                    <IconSymbol name="checkmark" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.successText}>
                    <Text style={[styles.successTitle, { color: colors.success }]}>
                        Form Generated Successfully
                    </Text>
                    <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
                        Use this as a reference to fill the physical form
                    </Text>
                </View>
            </View>

            {/* Image Preview */}
            <View style={styles.imageContainer}>
                <Card style={styles.imageCard} padding="sm">
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        contentFit="contain"
                    />
                </Card>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <Button
                    title="Save to Gallery"
                    onPress={handleSave}
                    loading={isSaving}
                    fullWidth
                    size="lg"
                    icon={<IconSymbol name="arrow.down.to.line" size={20} color="#FFFFFF" />}
                    style={styles.primaryButton}
                />

                <View style={styles.secondaryButtons}>
                    <Button
                        title="Share"
                        onPress={handleShare}
                        variant="outline"
                        style={styles.halfButton}
                        icon={<IconSymbol name="square.and.arrow.up" size={18} color={colors.primary} />}
                    />
                    <Button
                        title="New Form"
                        onPress={handleNewForm}
                        variant="secondary"
                        style={styles.halfButton}
                        icon={<IconSymbol name="plus" size={18} color={colors.primary} />}
                    />
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
        paddingVertical: Spacing.md,
    },
    backButton: {
        padding: Spacing.sm,
    },
    headerTitle: {
        flex: 1,
        fontSize: FontSize.xl,
        fontWeight: '700',
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Spacing.lg,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        gap: Spacing.md,
    },
    successIcon: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successText: {
        flex: 1,
    },
    successTitle: {
        fontSize: FontSize.md,
        fontWeight: '600',
    },
    successSubtitle: {
        fontSize: FontSize.sm,
        marginTop: 2,
    },
    imageContainer: {
        flex: 1,
        padding: Spacing.lg,
    },
    imageCard: {
        flex: 1,
        overflow: 'hidden',
    },
    image: {
        flex: 1,
        width: '100%',
        borderRadius: BorderRadius.md,
    },
    actions: {
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    primaryButton: {
        marginBottom: 0,
    },
    secondaryButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    halfButton: {
        flex: 1,
    },
});

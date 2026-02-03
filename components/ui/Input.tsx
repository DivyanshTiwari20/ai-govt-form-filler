/**
 * Custom Input Component
 * Clean text input with label and validation
 */

import React from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize } from '@/constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    required?: boolean;
}

export function Input({
    label,
    error,
    containerStyle,
    required = false,
    ...props
}: InputProps) {
    const colors = Colors.light; // Force light mode

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        {label}
                    </Text>
                    {required && (
                        <Text style={[styles.required, { color: colors.error }]}> *</Text>
                    )}
                </View>
            )}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error ? colors.error : colors.border,
                        color: colors.text,
                    },
                ]}
                placeholderTextColor={colors.textMuted}
                {...props}
            />
            {error && (
                <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    labelContainer: {
        flexDirection: 'row',
        marginBottom: Spacing.xs,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: '500',
    },
    required: {
        fontSize: FontSize.sm,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1.5,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        fontSize: FontSize.md,
    },
    error: {
        fontSize: FontSize.xs,
        marginTop: Spacing.xs,
    },
});

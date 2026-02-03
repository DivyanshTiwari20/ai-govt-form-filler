/**
 * Custom Button Component
 * Clean, animated button with multiple variants
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize } from '@/constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    style,
    textStyle,
    fullWidth = false,
}: ButtonProps) {
    const colors = Colors.light; // Force light mode

    const getButtonStyles = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: BorderRadius.md,
            opacity: disabled ? 0.5 : 1,
        };

        // Size styles
        const sizeStyles: Record<string, ViewStyle> = {
            sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
            md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
            lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl },
        };

        // Variant styles
        const variantStyles: Record<string, ViewStyle> = {
            primary: {
                backgroundColor: colors.primary,
            },
            secondary: {
                backgroundColor: colors.primaryLight,
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: colors.primary,
            },
            ghost: {
                backgroundColor: 'transparent',
            },
        };

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
            ...(fullWidth && { width: '100%' }),
        };
    };

    const getTextStyles = (): TextStyle => {
        const baseStyle: TextStyle = {
            fontWeight: '600',
        };

        const sizeStyles: Record<string, TextStyle> = {
            sm: { fontSize: FontSize.sm },
            md: { fontSize: FontSize.md },
            lg: { fontSize: FontSize.lg },
        };

        const variantStyles: Record<string, TextStyle> = {
            primary: { color: '#FFFFFF' },
            secondary: { color: colors.primary },
            outline: { color: colors.primary },
            ghost: { color: colors.primary },
        };

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
        };
    };

    return (
        <TouchableOpacity
            style={[getButtonStyles(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? '#FFFFFF' : colors.primary}
                    size="small"
                />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text style={[getTextStyles(), icon ? { marginLeft: Spacing.sm } : undefined, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

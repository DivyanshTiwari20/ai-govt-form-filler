/**
 * Custom Card Component
 * Elevated surface for content grouping
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    elevated?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, style, elevated = true, padding = 'md' }: CardProps) {
    const colors = Colors.light; // Force light mode

    const paddingStyles: Record<string, number> = {
        none: 0,
        sm: Spacing.sm,
        md: Spacing.md,
        lg: Spacing.lg,
    };

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
                    borderColor: colors.border,
                    padding: paddingStyles[padding],
                    shadowColor: colors.shadow,
                },
                elevated && styles.elevated,
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
    elevated: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 4,
    },
});

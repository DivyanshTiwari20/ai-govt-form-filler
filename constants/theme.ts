/**
 * Theme configuration for AI Form Filler App
 * Clean, professional color palette with soft gradients
 */

import { Platform } from 'react-native';

// Primary brand colors - Soft indigo/violet palette
const primaryLight = '#6366F1'; // Indigo 500
const primaryDark = '#818CF8';  // Indigo 400

export const Colors = {
  light: {
    text: '#1F2937',           // Gray 800
    textSecondary: '#6B7280',  // Gray 500
    textMuted: '#9CA3AF',      // Gray 400
    background: '#F9FAFB',     // Gray 50
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    primary: primaryLight,
    primaryLight: '#EEF2FF',   // Indigo 50
    accent: '#8B5CF6',         // Violet 500
    success: '#10B981',        // Emerald 500
    warning: '#F59E0B',        // Amber 500
    error: '#EF4444',          // Red 500
    border: '#E5E7EB',         // Gray 200
    borderLight: '#F3F4F6',    // Gray 100
    tint: primaryLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primaryLight,
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    text: '#F9FAFB',           // Gray 50
    textSecondary: '#D1D5DB',  // Gray 300
    textMuted: '#9CA3AF',      // Gray 400
    background: '#0F172A',     // Slate 900
    surface: '#1E293B',        // Slate 800
    surfaceElevated: '#334155',// Slate 700
    primary: primaryDark,
    primaryLight: '#312E81',   // Indigo 900
    accent: '#A78BFA',         // Violet 400
    success: '#34D399',        // Emerald 400
    warning: '#FBBF24',        // Amber 400
    error: '#F87171',          // Red 400
    border: '#334155',         // Slate 700
    borderLight: '#1E293B',    // Slate 800
    tint: primaryDark,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: primaryDark,
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  hero: 40,
};

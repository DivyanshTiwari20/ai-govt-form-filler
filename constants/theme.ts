/**
 * Theme configuration for Aadhaar Form Assistant
 * India-First: Saffron accent, Deep blue primary, Clean white background
 * Government-friendly, Trustworthy, Professional
 */

import { Platform } from 'react-native';

// India-first color palette
const saffron = '#FF6B35';        // Saffron/Orange accent
const deepBlue = '#1A365D';       // Deep navy blue (primary)
const trustBlue = '#2B6CB0';      // Trustworthy blue
const white = '#FFFFFF';          // Clean white
const softWhite = '#FAFAFA';      // Soft white background

export const Colors = {
  light: {
    text: '#1A202C',              // Almost black text
    textSecondary: '#4A5568',     // Gray 600
    textMuted: '#718096',         // Gray 500
    background: softWhite,        // Soft white
    surface: white,               // Pure white cards
    surfaceElevated: white,
    primary: deepBlue,            // Deep blue primary
    primaryLight: '#EBF8FF',      // Light blue tint
    accent: saffron,              // Saffron accent
    accentLight: '#FFF5F0',       // Light saffron
    success: '#38A169',           // Green 500
    successLight: '#C6F6D5',      // Green 100
    warning: '#DD6B20',           // Orange 600
    warningLight: '#FEEBC8',      // Orange 100
    error: '#E53E3E',             // Red 500
    errorLight: '#FED7D7',        // Red 100
    border: '#E2E8F0',            // Gray 200
    borderLight: '#EDF2F7',       // Gray 100
    tint: deepBlue,
    icon: '#4A5568',
    tabIconDefault: '#A0AEC0',
    tabIconSelected: saffron,
    shadow: 'rgba(26, 54, 93, 0.08)',

    // India-specific
    saffron: saffron,
    navy: deepBlue,
    trustBlue: trustBlue,
  },
  dark: {
    text: '#F7FAFC',
    textSecondary: '#CBD5E0',
    textMuted: '#A0AEC0',
    background: '#1A202C',
    surface: '#2D3748',
    surfaceElevated: '#4A5568',
    primary: trustBlue,
    primaryLight: '#2A4365',
    accent: saffron,
    accentLight: '#744210',
    success: '#48BB78',
    successLight: '#276749',
    warning: '#ED8936',
    warningLight: '#744210',
    error: '#FC8181',
    errorLight: '#822727',
    border: '#4A5568',
    borderLight: '#2D3748',
    tint: trustBlue,
    icon: '#A0AEC0',
    tabIconDefault: '#718096',
    tabIconSelected: saffron,
    shadow: 'rgba(0, 0, 0, 0.3)',

    saffron: saffron,
    navy: '#2D3748',
    trustBlue: trustBlue,
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

export const Colors = {
  // Primary corporate blue theme
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // Sky blue for gradients
  sky: {
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
  },
  // Secondary green theme
  secondary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  // Teal/Turquoise
  teal: {
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
  },
  // Amber/Orange for warnings
  amber: {
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
  },
  // Orange
  orange: {
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
  },
  // Emerald green
  emerald: {
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
  },
  // Neutral gray tones (Slate palette)
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  // Slate (exact same as neutral for clarity)
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  // Status colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  // Priority colors
  priority: {
    urgent: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  // Badge colors (soft pastel)
  badge: {
    pending: '#FEF3C7', // Amber 100
    pendingText: '#D97706', // Amber 600
    in_progress: '#DBEAFE', // Blue 100
    in_progressText: '#2563EB', // Blue 600
    resolved: '#D1FAE5', // Emerald 100
    resolvedText: '#059669', // Emerald 600
  },
  // Background colors
  background: {
    primary: '#F8FAFC',
    secondary: '#FFFFFF',
    card: '#FFFFFF',
  },
  // Text colors
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
  },
};

// Gradient definitions
export const Gradients = {
  // Blue gradient for hero card
  heroCard: ['#2563EB', '#0284C7'],
  // Icon container gradients
  announcements: ['#3B82F6', '#2563EB'], // Blue
  sharing: ['#14B8A6', '#10B981'], // Teal to Green
  neighbors: ['#3B82F6', '#1E40AF'], // Blue to Navy
  faults: ['#FBBF24', '#F97316'], // Amber to Orange
  events: ['#059669', '#047857'], // Emerald
  documents: ['#10B981', '#0EA5E9'], // Green to Sky
  businesses: ['#F97316', '#EF4444'], // Orange to Red
  forum: ['#8B5CF6', '#6366F1'], // Purple to Indigo
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3.65,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

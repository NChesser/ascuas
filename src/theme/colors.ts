/**
 * Ascuas Design Tokens
 * Ember/amber color palette with light & dark modes.
 */

export const Colors = {
  // ── Brand / Ember ────────────────────────
  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber200: '#fde68a',
  amber300: '#fcd34d',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  amber600: '#d97706',
  amber700: '#b45309',
  amber800: '#92400e',
  amber900: '#78350f',

  orange50: '#fff7ed',
  orange100: '#ffedd5',
  orange200: '#fed7aa',

  // ── Neutrals ─────────────────────────────
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  black: '#000000',

  // ── Semantic ─────────────────────────────
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green300: '#86efac',
  green400: '#4ade80',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
  green800: '#166534',
  green900: '#14532d',

  emerald50: '#ecfdf5',
  emerald500: '#10b981',

  red400: '#f87171',
  red500: '#ef4444',
  red600: '#dc2626',
  red800: '#991b1b',

  blue100: '#dbeafe',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue900: '#1e3a5f',

  purple100: '#f3e8ff',
  purple500: '#a855f7',
  purple900: '#581c87',

  sky50: '#f0f9ff',
  sky200: '#bae6fd',
  sky400: '#38bdf8',
  sky600: '#0284c7',
  sky800: '#075985',
  sky950: '#082f49',

  yellow500: '#eab308',

  // ── Tier colors (hex equivalents of Tailwind) ──
  tierGreen: '#22c55e',
  tierGreenBg: '#dcfce7',
  tierGreenDarkBg: 'rgba(34,197,94,0.15)',

  tierBlue: '#3b82f6',
  tierBlueBg: '#dbeafe',
  tierBlueDarkBg: 'rgba(59,130,246,0.15)',

  tierPurple: '#a855f7',
  tierPurpleBg: '#f3e8ff',
  tierPurpleDarkBg: 'rgba(168,85,247,0.15)',

  tierAmber: '#f59e0b',
  tierAmberBg: '#fef3c7',
  tierAmberDarkBg: 'rgba(245,158,11,0.15)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

export const FontSize = {
  micro: 12,
  caption: 14,
  bodySm: 15,
  body: 17,
  label: 16,
  subtitle: 17,
  headline: 20,
  title: 24,
  display: 30,
} as const;

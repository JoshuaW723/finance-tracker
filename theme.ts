export const colors = {
  background: '#050505',
  card: '#0E0E0E',
  surface: '#121212',
  primary: '#3B82F6',
  primaryDark: '#1E40AF',
  text: '#F5F5F5',
  muted: '#9CA3AF',
  border: '#1F2937',
  success: '#22C55E',
  danger: '#F87171',
};

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.muted,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.muted,
  },
};

export const layout = {
  screenPadding: 20,
  gap: 16,
  radius: 16,
};

export const componentsTheme = {
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.radius,
    padding: layout.screenPadding,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: layout.radius,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: layout.radius,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.text,
    borderColor: colors.border,
    borderWidth: 1,
  },
};

export type ThemeColors = typeof colors;

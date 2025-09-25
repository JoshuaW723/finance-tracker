import { StyleSheet, Text, View } from 'react-native';
import { colors, layout, typography } from '../../theme';

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
        <Text style={styles.description}>
          We are designing a playful leaderboard to help you and your friends stay accountable.
          Expect streaks, badges, and insights that keep you motivated.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: layout.screenPadding,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.radius,
    padding: layout.screenPadding,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  title: {
    ...typography.title,
    fontSize: 26,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: '600',
  },
  description: {
    ...typography.body,
    lineHeight: 20,
    color: colors.muted,
  },
});

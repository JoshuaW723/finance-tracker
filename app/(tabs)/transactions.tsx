import { useMemo } from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, layout, typography } from '../../theme';
import { Transaction, useFinanceStore } from '../../lib/store';

function formatSectionTitle(dateKey: string) {
  const date = new Date(dateKey);
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
  return formatter.format(date);
}

export default function TransactionsScreen() {
  const profile = useFinanceStore((state) => state.profile);
  const transactions = useFinanceStore((state) => state.transactions);

  const sections = useMemo(() => {
    const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
      const key = new Date(transaction.date).toISOString().split('T')[0];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(transaction);
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([key, list]) => ({
        title: formatSectionTitle(key),
        data: list,
      }));
  }, [transactions]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: profile.currency || 'USD',
      }),
    [profile.currency]
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.note}>{item.note}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
            <View style={styles.amountWrapper}>
              <Text
                style={[
                  styles.amount,
                  { color: item.type === 'expense' ? colors.danger : colors.success },
                ]}
              >
                {item.type === 'expense' ? '-' : '+'}
                {currencyFormatter.format(item.amount)}
              </Text>
              <Text style={styles.typeLabel}>{item.type.toUpperCase()}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No transactions yet. Tap the add button on Home.</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 120,
    paddingTop: 32,
    gap: 12,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.muted,
    marginBottom: 12,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: layout.radius,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  note: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    ...typography.caption,
    marginTop: 4,
  },
  amountWrapper: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  typeLabel: {
    ...typography.caption,
    marginTop: 4,
    color: colors.muted,
  },
  separator: {
    height: 12,
  },
  emptyText: {
    ...typography.subtitle,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 80,
  },
});

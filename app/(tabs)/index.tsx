import { Link, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MiniBarChart } from '../../components/MiniBarChart';
import { colors, componentsTheme, layout, typography } from '../../theme';
import {
  summarizeTransactions,
  selectTransactionsByMonth,
  useFinanceStore,
} from '../../lib/store';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useFinanceStore((state) => state.profile);
  const transactions = useFinanceStore((state) => state.transactions);

  const { monthIncome, monthExpense, balance, chartData } = useMemo(() => {
    const monthlyTransactions = selectTransactionsByMonth(transactions, new Date());
    const summary = summarizeTransactions(monthlyTransactions);
    const balanceValue = summary.income - summary.expense;

    const totalsByDay = new Map<string, { income: number; expense: number }>();
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      totalsByDay.set(key, { income: 0, expense: 0 });
    }

    monthlyTransactions.forEach((transaction) => {
      const key = new Date(transaction.date).toISOString().split('T')[0];
      if (!totalsByDay.has(key)) {
        totalsByDay.set(key, { income: 0, expense: 0 });
      }
      const aggregate = totalsByDay.get(key)!;
      aggregate[transaction.type] += transaction.amount;
    });

    const labels: string[] = [];
    const values: number[] = [];
    Array.from(totalsByDay.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .forEach(([key, value]) => {
        labels.push(key.slice(5));
        values.push(value.expense - value.income);
      });

    return {
      monthIncome: summary.income,
      monthExpense: summary.expense,
      balance: balanceValue,
      chartData: { values, labels },
    };
  }, [transactions]);

  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: profile.currency || 'USD',
        maximumFractionDigits: 0,
      }).format(value);
    } catch (error) {
      return `${profile.currency} ${value.toFixed(0)}`;
    }
  };

  const recentTransactions = useMemo(() => transactions.slice(0, 4), [transactions]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.displayName}>{profile.name}</Text>
          </View>
          <Link href="/account" style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{profile.name.slice(0, 1)}</Text>
          </Link>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current balance</Text>
          <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
          <View style={styles.balanceMetaRow}>
            <View style={styles.balanceMetaItem}>
              <View style={[styles.dot, { backgroundColor: colors.success }]} />
              <Text style={styles.metaLabel}>Income</Text>
              <Text style={[styles.metaValue, { color: colors.success }]}>
                {formatCurrency(monthIncome)}
              </Text>
            </View>
            <View style={styles.balanceMetaItem}>
              <View style={[styles.dot, { backgroundColor: colors.danger }]} />
              <Text style={styles.metaLabel}>Spending</Text>
              <Text style={[styles.metaValue, { color: colors.danger }]}>
                {formatCurrency(monthExpense)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>This week pulse</Text>
            <Text style={styles.cardSubtitle}>Expense minus income</Text>
          </View>
          <MiniBarChart data={chartData.values} labels={chartData.labels} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <Link href="/transactions" style={styles.sectionLink}>
            See all
          </Link>
        </View>

        {recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionRow}>
            <View>
              <Text style={styles.transactionNote}>{transaction.note}</Text>
              <Text style={styles.transactionCategory}>{transaction.category}</Text>
            </View>
            <View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === 'expense'
                    ? { color: colors.danger }
                    : { color: colors.success },
                ]}
              >
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/transactions/new')}
        style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.98 }] }]}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 120,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 20,
    gap: layout.gap,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    ...typography.subtitle,
    color: colors.muted,
  },
  displayName: {
    ...typography.title,
    marginTop: 4,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  avatarText: {
    ...typography.subtitle,
    color: colors.text,
  },
  balanceCard: {
    ...componentsTheme.card,
    gap: 12,
  },
  balanceLabel: {
    ...typography.subtitle,
    color: colors.muted,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
  },
  balanceMetaRow: {
    flexDirection: 'row',
    gap: 18,
  },
  balanceMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartCard: {
    ...componentsTheme.card,
    gap: 16,
  },
  cardHeader: {
    gap: 4,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    ...typography.caption,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 18,
  },
  sectionLink: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  transactionRow: {
    backgroundColor: colors.surface,
    borderRadius: layout.radius,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  transactionNote: {
    ...typography.subtitle,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  transactionCategory: {
    ...typography.caption,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
  },
  transactionDate: {
    ...typography.caption,
    marginTop: 2,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    bottom: 34,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  fabIcon: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '700',
  },
});

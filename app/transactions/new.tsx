import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, componentsTheme, layout, typography } from '../../theme';
import { TransactionType, useFinanceStore } from '../../lib/store';

const typeOptions: TransactionType[] = ['expense', 'income'];

export default function NewTransactionModal() {
  const router = useRouter();
  const addTransaction = useFinanceStore((state) => state.addTransaction);

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date());

  const handleSubmit = () => {
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      return;
    }

    addTransaction({
      amount: parsedAmount,
      note: note.trim() || 'Untitled transaction',
      category: category.trim() || 'General',
      type,
      date: date.toISOString(),
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add transaction</Text>
          <Text style={styles.subtitle}>Track income and expenses in seconds.</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="Choose a tag"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            {typeOptions.map((option) => {
              const active = option === type;
              return (
                <Pressable
                  key={option}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  onPress={() => setType(option)}
                >
                  <Text style={[styles.typeText, active && styles.typeTextActive]}>
                    {option === 'expense' ? 'Expense' : 'Income'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.pickerWrapper}>
            <DateTimePicker
              value={date}
              onChange={(_, nextDate) => nextDate && setDate(nextDate)}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.cancelButton, pressed && styles.cancelButtonPressed]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Save</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: layout.screenPadding,
    gap: 24,
  },
  header: {
    gap: 6,
  },
  title: {
    ...typography.title,
    fontSize: 28,
  },
  subtitle: {
    ...typography.caption,
    color: colors.muted,
    lineHeight: 20,
  },
  field: {
    gap: 12,
  },
  label: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: '600',
  },
  input: {
    ...componentsTheme.input,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeChip: {
    borderRadius: layout.radius,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: colors.surface,
  },
  typeChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#0B1120',
  },
  typeText: {
    ...typography.subtitle,
    fontSize: 14,
  },
  typeTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  pickerWrapper: {
    backgroundColor: colors.surface,
    borderRadius: layout.radius,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    padding: layout.screenPadding,
    gap: 12,
    backgroundColor: colors.background,
  },
  cancelButton: {
    flex: 1,
    borderRadius: layout.radius,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  cancelButtonPressed: {
    backgroundColor: '#111827',
  },
  cancelText: {
    ...typography.subtitle,
    fontSize: 14,
  },
  submitButton: {
    flex: 1,
    borderRadius: layout.radius,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  submitText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

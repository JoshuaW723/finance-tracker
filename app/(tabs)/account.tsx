import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, componentsTheme, layout, typography } from '../../theme';
import { useFinanceStore } from '../../lib/store';

const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

export default function AccountScreen() {
  const profile = useFinanceStore((state) => state.profile);
  const updateProfile = useFinanceStore((state) => state.updateProfile);

  const [name, setName] = useState(profile.name);
  const [currency, setCurrency] = useState(profile.currency);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Hold up', 'Name cannot be empty.');
      return;
    }

    updateProfile({ name: name.trim(), currency });
    Alert.alert('Profile updated', 'We saved your new profile details.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.caption}>Shape how we greet you and which currency to use.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Display name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Currency</Text>
          <View style={styles.currencyRow}>
            {supportedCurrencies.map((code) => {
              const isActive = code === currency;
              return (
                <Pressable
                  key={code}
                  style={[styles.currencyChip, isActive && styles.currencyChipActive]}
                  onPress={() => setCurrency(code)}
                >
                  <Text style={[styles.currencyText, isActive && styles.currencyTextActive]}>
                    {code}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save changes</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: layout.screenPadding,
  },
  card: {
    ...componentsTheme.card,
    gap: 20,
  },
  title: {
    ...typography.title,
    fontSize: 26,
  },
  caption: {
    ...typography.body,
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
  currencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  currencyChip: {
    borderRadius: layout.radius,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  currencyChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#0B1120',
  },
  currencyText: {
    ...typography.subtitle,
    fontSize: 14,
  },
  currencyTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  saveButton: {
    ...componentsTheme.button,
    alignItems: 'center',
  },
  saveButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  saveButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

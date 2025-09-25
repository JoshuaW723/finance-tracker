import { create } from 'zustand';

export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  amount: number;
  note: string;
  type: TransactionType;
  category: string;
  date: string;
};

export type Profile = {
  name: string;
  currency: string;
};

type FinanceState = {
  profile: Profile;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateProfile: (profile: Partial<Profile>) => void;
};

const seedTransactions: Transaction[] = [
  {
    id: 't1',
    amount: 1200,
    note: 'Freelance UI project',
    type: 'income',
    category: 'Work',
    date: new Date().toISOString(),
  },
  {
    id: 't2',
    amount: 54,
    note: 'Late night ramen with friends',
    type: 'expense',
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 't3',
    amount: 320,
    note: 'DJ gig',
    type: 'income',
    category: 'Side Hustle',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 't4',
    amount: 90,
    note: 'Coworking membership',
    type: 'expense',
    category: 'Work',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 't5',
    amount: 18,
    note: 'Oat latte',
    type: 'expense',
    category: 'Coffee',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export const useFinanceStore = create<FinanceState>((set) => ({
  profile: {
    name: 'Avery',
    currency: 'USD',
  },
  transactions: seedTransactions,
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        {
          id: `t${Date.now()}`,
          ...transaction,
        },
        ...state.transactions,
      ],
    })),
  updateProfile: (profile) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...profile,
      },
    })),
}));

export const selectTransactionsByMonth = (transactions: Transaction[], date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
  });
};

export const summarizeTransactions = (transactions: Transaction[]) => {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );
};

export const groupTransactionsByDay = (transactions: Transaction[]) => {
  return transactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
    const day = new Date(transaction.date).toISOString().split('T')[0];
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(transaction);
    return acc;
  }, {});
};

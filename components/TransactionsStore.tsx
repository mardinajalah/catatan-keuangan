import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { getTransactions, addTransaction as addTransactionApi } from '../utils/transaction';
import { getToken } from '../utils/storage';

export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  category: string;
  date: string;
  note: string;
  amount: number;
  createdAt: string;
};

type TransactionInput = {
  type: TransactionType;
  title: string;
  category: string;
  date: string;
  note: string;
  amount: number;
};

type TransactionGroup = {
  id: string;
  dateLabel: string;
  total: number;
  items: Transaction[];
};

type TransactionsContextValue = {
  transactions: Transaction[];
  incomes: Transaction[];
  expenses: Transaction[];
  isLoading: boolean;
  addTransaction: (input: TransactionInput) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  clearTransactions: () => void;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

const normalizeDate = (value: string) => {
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  return new Date().toISOString().slice(0, 10);
};

export const getCurrentDateInput = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getTransactionMonth = (date: string) => date.slice(0, 7);

export const formatDateLabel = (date: string) => {
  const parsedDate = new Date(`${date}T00:00:00`);

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
};

export const formatMonthLabel = (month: string) => {
  const parsedDate = new Date(`${month}-01T00:00:00`);

  return new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
};

export const groupTransactionsByDate = (transactions: Transaction[]): TransactionGroup[] => {
  const grouped = transactions.reduce<Record<string, TransactionGroup>>((result, transaction) => {
    if (!result[transaction.date]) {
      result[transaction.date] = {
        id: transaction.date,
        dateLabel: formatDateLabel(transaction.date),
        total: 0,
        items: [],
      };
    }

    result[transaction.date].total += transaction.amount;
    result[transaction.date].items.push(transaction);

    return result;
  }, {});

  return Object.values(grouped).sort((a, b) => b.id.localeCompare(a.id));
};

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshTransactions = useCallback(async () => {
    const token = await getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const data = await getTransactions();
      const mappedData: Transaction[] = data.map((t: any) => ({
        id: t.id,
        type: t.type.toLowerCase() as TransactionType,
        title: t.description,
        category: 'Lainnya',
        date: t.date.split('T')[0],
        note: '',
        amount: t.amount,
        createdAt: t.createdAt,
      }));
      setTransactions(mappedData);
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  const value = useMemo<TransactionsContextValue>(() => {
    const incomes = transactions.filter((transaction) => transaction.type === 'income');
    const expenses = transactions.filter((transaction) => transaction.type === 'expense');

    return {
      transactions,
      incomes,
      expenses,
      isLoading,
      refreshTransactions,
      clearTransactions,
      addTransaction: async (input) => {
        try {
          await addTransactionApi({
            type: input.type.toUpperCase() as 'INCOME' | 'EXPENSE',
            amount: input.amount,
            description: input.title,
            date: input.date,
          });
          await refreshTransactions();
        } catch (error) {
          console.error('Failed to add transaction:', error);
          throw error;
        }
      },
    };
  }, [transactions, isLoading, refreshTransactions, clearTransactions]);

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error('useTransactions must be used inside TransactionsProvider');
  }

  return context;
};

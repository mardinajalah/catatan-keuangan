import api from './api';

export interface Transaction {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const addTransaction = async (data: CreateTransactionData): Promise<Transaction> => {
  try {
    const response = await api.post('/transactions', data);
    return response.data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

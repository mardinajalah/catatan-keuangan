import api from './api';

export interface Transaction {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE';
  title: string;
  category: string;
  note: string;
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  title: string;
  category: string;
  note: string;
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

export interface UpdateTransactionData {
  type?: 'INCOME' | 'EXPENSE';
  amount?: number;
  title?: string;
  category?: string;
  note?: string;
  date?: string;
}

export interface DeleteTransactionResponse {
  message: string;
}

export const updateTransaction = async (id: string, data: UpdateTransactionData): Promise<Transaction> => {
  try {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating transaction ${id}:`, error);
    throw error;
  }
};

export const deleteTransaction = async (id: string): Promise<DeleteTransactionResponse> => {
  try {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting transaction ${id}:`, error);
    throw error;
  }
};

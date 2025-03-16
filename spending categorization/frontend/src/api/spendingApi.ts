import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Transaction {
  description: string;
  amount: number;
  merchant_name?: string;
  category?: string;
  date?: string;
}

export interface TrainingData {
  transactions: Transaction[];
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictCategory = async (transaction: Transaction): Promise<string> => {
  const response = await api.post('/predict/', transaction);
  return response.data.category;
};

export const trainModel = async (data: TrainingData): Promise<void> => {
  await api.post('/train/', data);
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health/');
    return response.data.status === 'healthy';
  } catch {
    return false;
  }
}; 
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { predictCategory, Transaction } from '../api/spendingApi';

interface TransactionFormProps {
  onCategoryPredicted?: (category: string, transaction: Transaction) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onCategoryPredicted }) => {
  const [transaction, setTransaction] = useState<Transaction>({
    description: '',
    amount: 0,
    merchant_name: '',
    date: new Date().toISOString().split('T')[0],
  });

  const { mutate, isLoading, error } = useMutation({
    mutationFn: predictCategory,
    onSuccess: (category) => {
      onCategoryPredicted?.(category, transaction);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(transaction);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Enter Transaction Details
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={transaction.description}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={transaction.amount || ''}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={transaction.date}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Merchant Name (Optional)"
            name="merchant_name"
            value={transaction.merchant_name}
            onChange={handleChange}
            margin="normal"
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              Error: {(error as Error).message}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Predict Category'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}; 
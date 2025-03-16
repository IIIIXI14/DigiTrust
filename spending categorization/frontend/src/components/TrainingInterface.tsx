import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Alert,
  IconButton,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { trainModel, Transaction } from '../api/spendingApi';

interface TrainingInterfaceProps {
  transaction: Transaction;
  predictedCategory: string;
  onConfirm?: () => void;
  onSkip?: () => void;
}

const CATEGORIES = [
  'Groceries',
  'Transport',
  'Entertainment',
  'Food & Drink',
  'Shopping',
  'Housing',
  'Health & Fitness',
  'Bills & Utilities',
  'Travel',
  'Education',
  'Other',
];

export const TrainingInterface: React.FC<TrainingInterfaceProps> = ({
  transaction,
  predictedCategory,
  onConfirm,
  onSkip,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(predictedCategory);

  const { mutate: submitTraining, isLoading, error } = useMutation({
    mutationFn: trainModel,
    onSuccess: () => {
      onConfirm?.();
    },
  });

  const handleConfirm = () => {
    submitTraining({
      transactions: [
        {
          ...transaction,
          category: selectedCategory,
        },
      ],
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Improve Model Accuracy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please confirm or correct the predicted category to help improve the model's accuracy.
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Transaction Details:
            </Typography>
            <Typography variant="body1">
              {transaction.description}
              {transaction.merchant_name && ` - ${transaction.merchant_name}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Amount: ${transaction.amount.toFixed(2)}
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && (
            <Alert severity="error">
              Error submitting feedback. Please try again.
            </Alert>
          )}

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              disabled={isLoading}
              startIcon={<CheckIcon />}
              fullWidth
            >
              Confirm Category
            </Button>
            <IconButton
              color="default"
              onClick={onSkip}
              disabled={isLoading}
              sx={{ border: 1, borderColor: 'divider' }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}; 
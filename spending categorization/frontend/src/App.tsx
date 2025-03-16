import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  Tab,
  Tabs,
} from '@mui/material'
import { theme } from './theme/theme'
import { TransactionForm } from './components/TransactionForm'
import { TransactionDashboard } from './components/TransactionDashboard'
import { TrainingInterface } from './components/TrainingInterface'
import { Transaction } from './api/spendingApi'

const queryClient = new QueryClient()

function App() {
  const [currentTab, setCurrentTab] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null)
  const [predictedCategory, setPredictedCategory] = useState<string | null>(null)

  const handleCategoryPredicted = (category: string, transaction: Transaction) => {
    setPredictedCategory(category)
    setCurrentTransaction(transaction)
  }

  const handleTrainingConfirmed = () => {
    if (currentTransaction && predictedCategory) {
      setTransactions([
        ...transactions,
        { ...currentTransaction, category: predictedCategory },
      ])
      setCurrentTransaction(null)
      setPredictedCategory(null)
    }
  }

  const handleTrainingSkipped = () => {
    setCurrentTransaction(null)
    setPredictedCategory(null)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                💰 Spending Categorization
              </Typography>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue) => setCurrentTab(newValue)}
              sx={{ mb: 4 }}
            >
              <Tab label="Categorize Transaction" />
              <Tab label="Dashboard" />
            </Tabs>

            {currentTab === 0 && (
              <Box>
                <Typography variant="h4" gutterBottom>
                  Transaction Categorization
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Enter your transaction details below to automatically categorize your spending.
                </Typography>

                <Box sx={{ display: 'grid', gap: 3 }}>
                  <TransactionForm
                    onCategoryPredicted={handleCategoryPredicted}
                  />

                  {currentTransaction && predictedCategory && (
                    <TrainingInterface
                      transaction={currentTransaction}
                      predictedCategory={predictedCategory}
                      onConfirm={handleTrainingConfirmed}
                      onSkip={handleTrainingSkipped}
                    />
                  )}
                </Box>
              </Box>
            )}

            {currentTab === 1 && (
              <TransactionDashboard transactions={transactions} />
            )}
          </Container>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App

"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Calculator,
  CreditCard,
  TrendingUp,
  PiggyBank,
  Coins,
  LineChart,
  BarChart3,
  Search,
  Volume2,
} from "lucide-react"
import { speakText } from "@/utils/speech-utils"

interface FinancialToolsProps {
  language: string
}

// Complete translations for all languages
const translations = {
  english: {
    loanCalculator: {
      title: "Loan EMI Calculator",
      description: "Calculate your monthly loan payments",
      loanAmount: "Loan Amount",
      interestRate: "Interest Rate (%)",
      loanTerm: "Loan Term (years)",
      calculate: "Calculate EMI",
      monthlyPayment: "Monthly Payment",
      totalInterest: "Total Interest",
      totalPayment: "Total Payment",
    },
    investmentCalculator: {
      title: "Investment Calculator",
      description: "Calculate returns on your investments",
      initialInvestment: "Initial Investment",
      monthlyContribution: "Monthly Contribution",
      annualReturn: "Annual Return (%)",
      investmentPeriod: "Investment Period (years)",
      calculate: "Calculate Returns",
      futureValue: "Future Value",
      totalContributions: "Total Contributions",
      totalInterest: "Total Interest Earned",
    },
    creditScore: {
      title: "Credit Score Tracker",
      description: "Monitor and improve your credit score",
      currentScore: "Current Credit Score",
      checkScore: "Check Score",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
      veryPoor: "Very Poor",
      tips: "Tips to Improve",
      tip1: "Pay your bills on time",
      tip2: "Reduce your credit utilization",
      tip3: "Don't close old credit accounts",
      tip4: "Limit new credit applications",
      tip5: "Regularly check your credit report",
    },
    budgetPlanner: {
      title: "Budget Planner",
      description: "Plan and track your monthly expenses",
      income: "Monthly Income",
      housing: "Housing",
      utilities: "Utilities",
      food: "Food",
      transportation: "Transportation",
      healthcare: "Healthcare",
      entertainment: "Entertainment",
      savings: "Savings",
      other: "Other",
      calculate: "Calculate Budget",
      totalExpenses: "Total Expenses",
      remaining: "Remaining",
      budgetChart: "Budget Breakdown",
    },
    stockTracker: {
      title: "Stock Market Tracker",
      description: "Track stock performance and get insights",
      searchStock: "Search Stock",
      search: "Search",
      stockPrice: "Current Price",
      dayChange: "Day Change",
      marketCap: "Market Cap",
      peRatio: "P/E Ratio",
      dividend: "Dividend Yield",
      recommendation: "AI Recommendation",
      popularStocks: "Popular Stocks",
    },
    goldInvestment: {
      title: "Digital Gold Calculator",
      description: "Calculate returns on digital gold investments",
      investmentAmount: "Investment Amount",
      goldPrice: "Current Gold Price (per gram)",
      investmentPeriod: "Investment Period (years)",
      expectedGrowth: "Expected Annual Growth (%)",
      calculate: "Calculate Returns",
      futureValue: "Future Value",
      quantityInGrams: "Gold Quantity (grams)",
      valueGrowth: "Value Growth",
    },
  },
  hindi: {
    loanCalculator: {
      title: "ऋण ईएमआई कैलकुलेटर",
      description: "अपने मासिक ऋण भुगतान की गणना करें",
      loanAmount: "ऋण राशि",
      interestRate: "ब्याज दर (%)",
      loanTerm: "ऋण अवधि (वर्ष)",
      calculate: "ईएमआई की गणना करें",
      monthlyPayment: "मासिक भुगतान",
      totalInterest: "कुल ब्याज",
      totalPayment: "कुल भुगतान",
    },
    investmentCalculator: {
      title: "निवेश कैलकुलेटर",
      description: "अपने निवेश पर रिटर्न की गणना करें",
      initialInvestment: "प्रारंभिक निवेश",
      monthlyContribution: "मासिक योगदान",
      annualReturn: "वार्षिक रिटर्न (%)",
      investmentPeriod: "निवेश अवधि (वर्ष)",
      calculate: "रिटर्न की गणना करें",
      futureValue: "भविष्य मूल्य",
      totalContributions: "कुल योगदान",
      totalInterest: "कुल अर्जित ब्याज",
    },
    creditScore: {
      title: "क्रेडिट स्कोर ट्रैकर",
      description: "अपने क्रेडिट स्कोर की निगरानी करें और सुधारें",
      currentScore: "वर्तमान क्रेडिट स्कोर",
      checkScore: "स्कोर जांचें",
      excellent: "उत्कृष्ट",
      good: "अच्छा",
      fair: "उचित",
      poor: "खराब",
      veryPoor: "बहुत खराब",
      tips: "सुधार के लिए सुझाव",
      tip1: "अपने बिल समय पर चुकाएं",
      tip2: "अपने क्रेडिट उपयोग को कम करें",
      tip3: "पुराने क्रेडिट खाते बंद न करें",
      tip4: "नए क्रेडिट आवेदनों को सीमित करें",
      tip5: "नियमित रूप से अपनी क्रेडिट रिपोर्ट की जांच करें",
    },
    budgetPlanner: {
      title: "बजट प्लानर",
      description: "अपने मासिक खर्चों की योजना बनाएं और ट्रैक करें",
      income: "मासिक आय",
      housing: "आवास",
      utilities: "उपयोगिताएं",
      food: "भोजन",
      transportation: "परिवहन",
      healthcare: "स्वास्थ्य देखभाल",
      entertainment: "मनोरंजन",
      savings: "बचत",
      other: "अन्य",
      calculate: "बजट की गणना करें",
      totalExpenses: "कुल खर्च",
      remaining: "शेष",
      budgetChart: "बजट ब्रेकडाउन",
    },
    stockTracker: {
      title: "स्टॉक मार्केट ट्रैकर",
      description: "स्टॉक प्रदर्शन को ट्रैक करें और अंतर्दृष्टि प्राप्त करें",
      searchStock: "स्टॉक खोजें",
      search: "खोज",
      stockPrice: "वर्तमान मूल्य",
      dayChange: "दिन का परिवर्तन",
      marketCap: "मार्केट कैप",
      peRatio: "पी/ई अनुपात",
      dividend: "लाभांश उपज",
      recommendation: "एआई अनुशंसा",
      popularStocks: "लोकप्रिय स्टॉक",
    },
    goldInvestment: {
      title: "डिजिटल गोल्ड कैलकुलेटर",
      description: "डिजिटल गोल्ड निवेश पर रिटर्न की गणना करें",
      investmentAmount: "निवेश राशि",
      goldPrice: "वर्तमान सोने का मूल्य (प्रति ग्राम)",
      investmentPeriod: "निवेश अवधि (वर्ष)",
      expectedGrowth: "अपेक्षित वार्षिक वृद्धि (%)",
      calculate: "रिटर्न की गणना करें",
      futureValue: "भविष्य मूल्य",
      quantityInGrams: "सोने की मात्रा (ग्राम)",
      valueGrowth: "मूल्य वृद्धि",
    },
  },
  marathi: {
    loanCalculator: {
      title: "कर्ज ईएमआय कॅल्क्युलेटर",
      description: "तुमच्या मासिक कर्ज भरणाची गणना करा",
      loanAmount: "कर्ज रक्कम",
      interestRate: "व्याज दर (%)",
      loanTerm: "कर्ज कालावधी (वर्षे)",
      calculate: "ईएमआय गणना करा",
      monthlyPayment: "मासिक भरणा",
      totalInterest: "एकूण व्याज",
      totalPayment: "एकूण भरणा",
    },
    investmentCalculator: {
      title: "गुंतवणूक कॅल्क्युलेटर",
      description: "तुमच्या गुंतवणुकीवरील परतावा गणना करा",
      initialInvestment: "प्रारंभिक गुंतवणूक",
      monthlyContribution: "मासिक योगदान",
      annualReturn: "वार्षिक परतावा (%)",
      investmentPeriod: "गुंतवणूक कालावधी (वर्षे)",
      calculate: "परतावा गणना करा",
      futureValue: "भविष्यातील मूल्य",
      totalContributions: "एकूण योगदान",
      totalInterest: "एकूण मिळालेले व्याज",
    },
    creditScore: {
      title: "क्रेडिट स्कोअर ट्रॅकर",
      description: "तुमचा क्रेडिट स्कोअर मॉनिटर करा आणि सुधारा",
      currentScore: "सध्याचा क्रेडिट स्कोअर",
      checkScore: "स्कोअर तपासा",
      excellent: "उत्कृष्ट",
      good: "चांगला",
      fair: "समाधानकारक",
      poor: "कमकुवत",
      veryPoor: "अत्यंत कमकुवत",
      tips: "सुधारण्यासाठी टिप्स",
      tip1: "तुमची बिले वेळेवर भरा",
      tip2: "तुमचा क्रेडिट वापर कमी करा",
      tip3: "जुने क्रेडिट खाते बंद करू नका",
      tip4: "नवीन क्रेडिट अर्ज मर्यादित करा",
      tip5: "नियमितपणे तुमचा क्रेडिट अहवाल तपासा",
    },
    budgetPlanner: {
      title: "बजेट प्लॅनर",
      description: "तुमच्या मासिक खर्चांचे नियोजन करा आणि ट्रॅक करा",
      income: "मासिक उत्पन्न",
      housing: "घरखर्च",
      utilities: "उपयोगिता",
      food: "अन्न",
      transportation: "वाहतूक",
      healthcare: "आरोग्य सेवा",
      entertainment: "मनोरंजन",
      savings: "बचत",
      other: "इतर",
      calculate: "बजेट गणना करा",
      totalExpenses: "एकूण खर्च",
      remaining: "शिल्लक",
      budgetChart: "बजेट विभाजन",
    },
    stockTracker: {
      title: "स्टॉक मार्केट ट्रॅकर",
      description: "स्टॉक कामगिरी ट्रॅक करा आणि अंतर्दृष्टी मिळवा",
      searchStock: "स्टॉक शोधा",
      search: "शोध",
      stockPrice: "सध्याची किंमत",
      dayChange: "दिवसाचा बदल",
      marketCap: "मार्केट कॅप",
      peRatio: "पी/ई गुणोत्तर",
      dividend: "लाभांश उत्पन्न",
      recommendation: "एआय शिफारस",
      popularStocks: "लोकप्रिय स्टॉक्स",
    },
    goldInvestment: {
      title: "डिजिटल गोल्ड कॅल्क्युलेटर",
      description: "डिजिटल गोल्ड गुंतवणुकीवरील परतावा गणना करा",
      investmentAmount: "गुंतवणूक रक्कम",
      goldPrice: "सध्याची सोन्याची किंमत (प्रति ग्रॅम)",
      investmentPeriod: "गुंतवणूक कालावधी (वर्षे)",
      expectedGrowth: "अपेक्षित वार्षिक वाढ (%)",
      calculate: "परतावा गणना करा",
      futureValue: "भविष्यातील मूल्य",
      quantityInGrams: "सोन्याचे प्रमाण (ग्रॅम)",
      valueGrowth: "मूल्य वाढ",
    },
  },
  tamil: {
    loanCalculator: {
      title: "கடன் EMI கணிப்பான்",
      description: "உங்கள் மாதாந்திர கடன் கட்டணங்களை கணக்கிடுங்கள்",
      loanAmount: "கடன் தொகை",
      interestRate: "வட்டி விகிதம் (%)",
      loanTerm: "கடன் காலம் (ஆண்டுகள்)",
      calculate: "EMI ஐ கணக்கிடு",
      monthlyPayment: "மாதாந்திர கட்டணம்",
      totalInterest: "மொத்த வட்டி",
      totalPayment: "மொத்த கட்டணம்",
    },
    investmentCalculator: {
      title: "முதலீட்டு கணிப்பான்",
      description: "உங்கள் முதலீடுகளில் வருமானத்தை கணக்கிடுங்கள்",
      initialInvestment: "ஆரம்ப முதலீடு",
      monthlyContribution: "மாதாந்திர பங்களிப்பு",
      annualReturn: "வருடாந்திர வருமானம் (%)",
      investmentPeriod: "முதலீட்டு காலம் (ஆண்டுகள்)",
      calculate: "வருமானத்தை கணக்கிடு",
      futureValue: "எதிர்கால மதிப்பு",
      totalContributions: "மொத்த பங்களிப்புகள்",
      totalInterest: "மொத்த பெறப்பட்ட வட்டி",
    },
    creditScore: {
      title: "கடன் மதிப்பெண் கண்காணிப்பு",
      description: "உங்கள் கடன் மதிப்பெண்ணை கண்காணித்து மேம்படுத்துங்கள்",
      currentScore: "தற்போதைய கடன் மதிப்பெண்",
      checkScore: "மதிப்பெண்ணை சரிபார்க்கவும்",
      excellent: "சிறந்தது",
      good: "நல்லது",
      fair: "நியாயமானது",
      poor: "மோசமானது",
      veryPoor: "மிகவும் மோசமானது",
      tips: "மேம்படுத்த உதவிக்குறிப்புகள்",
      tip1: "உங்கள் பில்களை உரிய நேரத்தில் செலுத்துங்கள்",
      tip2: "உங்கள் கடன் பயன்பாட்டை குறைக்கவும்",
      tip3: "பழைய கடன் கணக்குகளை மூட வேண்டாம்",
      tip4: "புதிய கடன் விண்ணப்பங்களை கட்டுப்படுத்துங்கள்",
      tip5: "உங்கள் கடன் அறிக்கையை தொடர்ந்து சரிபார்க்கவும்",
    },
    budgetPlanner: {
      title: "பட்ஜெட் திட்டமிடல்",
      description: "உங்கள் மாதாந்திர செலவுகளை திட்டமிட்டு கண்காணிக்கவும்",
      income: "மாதாந்திர வருமானம்",
      housing: "வீட்டு வசதி",
      utilities: "பயன்பாடுகள்",
      food: "உணவு",
      transportation: "போக்குவரத்து",
      healthcare: "சுகாதார பராமரிப்பு",
      entertainment: "பொழுதுபோக்கு",
      savings: "சேமிப்புகள்",
      other: "மற்றவை",
      calculate: "பட்ஜெட் கணக்கிடு",
      totalExpenses: "மொத்த செலவுகள்",
      remaining: "மீதமுள்ள",
      budgetChart: "பட்ஜெட் பகுப்பாய்வு",
    },
    stockTracker: {
      title: "பங்கு சந்தை கண்காணிப்பு",
      description: "பங்கு செயல்திறனை கண்காணித்து நுண்ணறிவுகளைப் பெறுங்கள்",
      searchStock: "பங்கு தேடல்",
      search: "தேடு",
      stockPrice: "தற்போதைய விலை",
      dayChange: "நாள் மாற்றம்",
      marketCap: "சந்தை மதிப்பு",
      peRatio: "P/E விகிதம்",
      dividend: "பங்காதாய விளைச்சல்",
      recommendation: "AI பரிந்துரை",
      popularStocks: "பிரபலமான பங்குகள்",
    },
    goldInvestment: {
      title: "டிஜிட்டல் தங்க கணிப்பான்",
      description: "டிஜிட்டல் தங்க முதலீடுகளில் வருமானத்தை கணக்கிடுங்கள்",
      investmentAmount: "முதலீட்டு தொகை",
      goldPrice: "தற்போதைய தங்க விலை (கிராம் ஒன்றுக்கு)",
      investmentPeriod: "முதலீட்டு காலம் (ஆண்டுகள்)",
      expectedGrowth: "எதிர்பார்க்கப்படும் வருடாந்திர வளர்ச்சி (%)",
      calculate: "வருமானத்தை கணக்கிடு",
      futureValue: "எதிர்கால மதிப்பு",
      quantityInGrams: "தங்க அளவு (கிராம்)",
      valueGrowth: "மதிப்பு வளர்ச்சி",
    },
  },
  // Add translations for other languages similarly
}

// Mock stock data for NSE
const mockStocks = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    price: 2856.75,
    change: 1.25,
    marketCap: "19,34,567 Cr",
    peRatio: 28.5,
    dividend: 0.7,
    recommendation: "BUY",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd.",
    price: 3456.2,
    change: -0.75,
    marketCap: "12,65,432 Cr",
    peRatio: 32.1,
    dividend: 1.2,
    recommendation: "HOLD",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    price: 1678.5,
    change: 0.45,
    marketCap: "9,32,145 Cr",
    peRatio: 24.3,
    dividend: 1.0,
    recommendation: "BUY",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd.",
    price: 1432.8,
    change: -1.2,
    marketCap: "5,98,765 Cr",
    peRatio: 27.8,
    dividend: 2.1,
    recommendation: "HOLD",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd.",
    price: 945.3,
    change: 0.85,
    marketCap: "6,54,321 Cr",
    peRatio: 22.5,
    dividend: 0.8,
    recommendation: "BUY",
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd.",
    price: 2543.65,
    change: 0.25,
    marketCap: "5,87,654 Cr",
    peRatio: 65.4,
    dividend: 1.5,
    recommendation: "HOLD",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 567.4,
    change: 2.1,
    marketCap: "5,12,345 Cr",
    peRatio: 12.3,
    dividend: 2.5,
    recommendation: "BUY",
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Ltd.",
    price: 7123.9,
    change: -0.5,
    marketCap: "4,32,198 Cr",
    peRatio: 45.6,
    dividend: 0.2,
    recommendation: "HOLD",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd.",
    price: 876.25,
    change: 1.75,
    marketCap: "4,87,654 Cr",
    peRatio: 32.1,
    dividend: 0.5,
    recommendation: "BUY",
  },
  {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank Ltd.",
    price: 1765.8,
    change: -0.3,
    marketCap: "3,54,678 Cr",
    peRatio: 28.7,
    dividend: 0.6,
    recommendation: "HOLD",
  },
]

export default function FinancialTools({ language }: FinancialToolsProps) {
  // Create a memoized translation getter to ensure consistent language updates
  const getTranslation = useCallback(() => {
    const langTranslation = translations[language as keyof typeof translations]

    if (!langTranslation) {
      return translations.english
    }

    return langTranslation
  }, [language])

  // Get translations for the current language
  const t = getTranslation()

  // Loan Calculator State
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(8)
  const [loanTerm, setLoanTerm] = useState(20)
  const [emiResult, setEmiResult] = useState<{
    emi: number
    totalInterest: number
    totalPayment: number
  } | null>(null)

  // Investment Calculator State
  const [initialInvestment, setInitialInvestment] = useState(100000)
  const [monthlyContribution, setMonthlyContribution] = useState(10000)
  const [annualReturn, setAnnualReturn] = useState(12)
  const [investmentPeriod, setInvestmentPeriod] = useState(10)
  const [investmentResult, setInvestmentResult] = useState<{
    futureValue: number
    totalContributions: number
    totalInterest: number
  } | null>(null)

  // Credit Score State
  const [creditScore, setCreditScore] = useState(750)

  // Budget Planner State
  const [income, setIncome] = useState(50000)
  const [expenses, setExpenses] = useState({
    housing: 15000,
    utilities: 5000,
    food: 8000,
    transportation: 3000,
    healthcare: 2000,
    entertainment: 4000,
    savings: 10000,
    other: 3000,
  })

  // Stock Market State
  const [stockSearch, setStockSearch] = useState("")
  const [selectedStock, setSelectedStock] = useState(mockStocks[0])
  const [filteredStocks, setFilteredStocks] = useState(mockStocks)

  // Gold Investment State
  const [goldInvestmentAmount, setGoldInvestmentAmount] = useState(50000)
  const [goldPrice, setGoldPrice] = useState(5500)
  const [goldInvestmentPeriod, setGoldInvestmentPeriod] = useState(5)
  const [goldGrowthRate, setGoldGrowthRate] = useState(10)
  const [goldResult, setGoldResult] = useState<{
    futureValue: number
    quantityInGrams: number
    valueGrowth: number
  } | null>(null)

  // Update budget percentages when income changes
  useEffect(() => {
    // Default percentages for budget allocation
    const defaultPercentages = {
      housing: 30,
      utilities: 10,
      food: 15,
      transportation: 10,
      healthcare: 5,
      entertainment: 10,
      savings: 15,
      other: 5,
    }

    // Calculate new expenses based on income and default percentages
    const newExpenses = Object.entries(defaultPercentages).reduce(
      (acc, [category, percentage]) => {
        acc[category as keyof typeof expenses] = Math.round((percentage / 100) * income)
        return acc
      },
      {} as typeof expenses,
    )

    setExpenses(newExpenses)
  }, [income])

  // Filter stocks based on search
  useEffect(() => {
    if (stockSearch.trim() === "") {
      setFilteredStocks(mockStocks)
    } else {
      const filtered = mockStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(stockSearch.toLowerCase()) ||
          stock.name.toLowerCase().includes(stockSearch.toLowerCase()),
      )
      setFilteredStocks(filtered)
    }
  }, [stockSearch])

  // Calculate Loan EMI using the correct formula
  const calculateEMI = () => {
    const principal = loanAmount
    const monthlyInterestRate = interestRate / 12 / 100
    const numberOfPayments = loanTerm * 12

    // Correct EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    // This is the standard formula for EMI calculation used by banks
    const emi =
      (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)

    const totalPayment = emi * numberOfPayments
    const totalInterest = totalPayment - principal

    setEmiResult({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    })
  }

  // Calculate Investment Returns
  const calculateInvestmentReturns = () => {
    const monthlyRate = annualReturn / 12 / 100
    const months = investmentPeriod * 12

    // Calculate future value of initial investment
    const futureValueInitial = initialInvestment * Math.pow(1 + monthlyRate, months)

    // Calculate future value of monthly contributions
    // Formula: PMT * (((1 + r)^n - 1) / r) * (1 + r)
    let futureValueContributions = 0
    if (monthlyRate > 0) {
      futureValueContributions =
        monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
    } else {
      futureValueContributions = monthlyContribution * months
    }

    const futureValue = futureValueInitial + futureValueContributions
    const totalContributions = initialInvestment + monthlyContribution * months
    const totalInterest = futureValue - totalContributions

    setInvestmentResult({
      futureValue: Math.round(futureValue),
      totalContributions: Math.round(totalContributions),
      totalInterest: Math.round(totalInterest),
    })
  }

  // Calculate Gold Investment Returns
  const calculateGoldReturns = () => {
    const quantityInGrams = goldInvestmentAmount / goldPrice
    const futureValue = goldInvestmentAmount * Math.pow(1 + goldGrowthRate / 100, goldInvestmentPeriod)
    const valueGrowth = futureValue - goldInvestmentAmount

    setGoldResult({
      futureValue: Math.round(futureValue),
      quantityInGrams: Math.round(quantityInGrams * 100) / 100,
      valueGrowth: Math.round(valueGrowth),
    })
  }

  // Get credit score rating
  const getCreditScoreRating = () => {
    if (creditScore >= 750) return t.creditScore.excellent
    if (creditScore >= 700) return t.creditScore.good
    if (creditScore >= 650) return t.creditScore.fair
    if (creditScore >= 600) return t.creditScore.poor
    return t.creditScore.veryPoor
  }

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return Object.values(expenses).reduce((sum, expense) => sum + expense, 0)
  }

  // Function to speak financial information
  const speakFinancialInfo = (text: string) => {
    speakText(text, language, undefined, (error) => {
      console.error("Error speaking financial info:", error)
    })
  }

  return (
    <Tabs defaultValue="loan" className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
        <TabsTrigger value="loan">
          <Calculator className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">EMI</span>
        </TabsTrigger>
        <TabsTrigger value="investment">
          <PiggyBank className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Investment</span>
        </TabsTrigger>
        <TabsTrigger value="credit">
          <CreditCard className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Credit</span>
        </TabsTrigger>
        <TabsTrigger value="budget">
          <BarChart3 className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Budget</span>
        </TabsTrigger>
        <TabsTrigger value="stock">
          <TrendingUp className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Stocks</span>
        </TabsTrigger>
        <TabsTrigger value="gold">
          <Coins className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Gold</span>
        </TabsTrigger>
      </TabsList>

      <div className="overflow-y-auto">
        {/* Loan EMI Calculator */}
        <TabsContent value="loan">
          <Card>
            <CardHeader>
              <CardTitle>{t.loanCalculator.title}</CardTitle>
              <CardDescription>{t.loanCalculator.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loan-amount">{t.loanCalculator.loanAmount}</Label>
                <Input
                  id="loan-amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest-rate">{t.loanCalculator.interestRate}</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="interest-rate"
                    min={1}
                    max={20}
                    step={0.1}
                    value={[interestRate]}
                    onValueChange={(value) => setInterestRate(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{interestRate}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan-term">{t.loanCalculator.loanTerm}</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="loan-term"
                    min={1}
                    max={30}
                    step={1}
                    value={[loanTerm]}
                    onValueChange={(value) => setLoanTerm(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{loanTerm}</span>
                </div>
              </div>

              <Button onClick={calculateEMI} className="w-full">
                {t.loanCalculator.calculate}
              </Button>

              {emiResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>{t.loanCalculator.monthlyPayment}:</span>
                    <span className="font-bold">₹{emiResult.emi.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.loanCalculator.totalInterest}:</span>
                    <span className="font-bold">₹{emiResult.totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.loanCalculator.totalPayment}:</span>
                    <span className="font-bold">₹{emiResult.totalPayment.toLocaleString()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() =>
                      speakFinancialInfo(
                        `${t.loanCalculator.monthlyPayment}: ${emiResult.emi.toLocaleString()} rupees. 
                      ${t.loanCalculator.totalInterest}: ${emiResult.totalInterest.toLocaleString()} rupees. 
                      ${t.loanCalculator.totalPayment}: ${emiResult.totalPayment.toLocaleString()} rupees.`,
                      )
                    }
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    <span>{t.listenButton || "Listen"}</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Calculator */}
        <TabsContent value="investment">
          <Card>
            <CardHeader>
              <CardTitle>{t.investmentCalculator.title}</CardTitle>
              <CardDescription>{t.investmentCalculator.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initial-investment">{t.investmentCalculator.initialInvestment}</Label>
                <Input
                  id="initial-investment"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-contribution">{t.investmentCalculator.monthlyContribution}</Label>
                <Input
                  id="monthly-contribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual-return">{t.investmentCalculator.annualReturn}</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="annual-return"
                    min={1}
                    max={20}
                    step={0.1}
                    value={[annualReturn]}
                    onValueChange={(value) => setAnnualReturn(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{annualReturn}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment-period">{t.investmentCalculator.investmentPeriod}</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="investment-period"
                    min={1}
                    max={30}
                    step={1}
                    value={[investmentPeriod]}
                    onValueChange={(value) => setInvestmentPeriod(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{investmentPeriod}</span>
                </div>
              </div>

              <Button onClick={calculateInvestmentReturns} className="w-full">
                {t.investmentCalculator.calculate}
              </Button>

              {investmentResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>{t.investmentCalculator.futureValue}:</span>
                    <span className="font-bold">₹{investmentResult.futureValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.investmentCalculator.totalContributions}:</span>
                    <span className="font-bold">₹{investmentResult.totalContributions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.investmentCalculator.totalInterest}:</span>
                    <span className="font-bold">₹{investmentResult.totalInterest.toLocaleString()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() =>
                      speakFinancialInfo(
                        `${t.investmentCalculator.futureValue}: ${investmentResult.futureValue.toLocaleString()} rupees. 
                      ${t.investmentCalculator.totalContributions}: ${investmentResult.totalContributions.toLocaleString()} rupees. 
                      ${t.investmentCalculator.totalInterest}: ${investmentResult.totalInterest.toLocaleString()} rupees.`,
                      )
                    }
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    <span>{t.listenButton || "Listen"}</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credit Score Tracker */}
        <TabsContent value="credit">
          <Card>
            <CardHeader>
              <CardTitle>{t.creditScore.title}</CardTitle>
              <CardDescription>{t.creditScore.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="credit-score">{t.creditScore.currentScore}</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="credit-score"
                    min={300}
                    max={900}
                    step={1}
                    value={[creditScore]}
                    onValueChange={(value) => setCreditScore(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{creditScore}</span>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      creditScore >= 750
                        ? "bg-green-500"
                        : creditScore >= 700
                          ? "bg-blue-500"
                          : creditScore >= 650
                            ? "bg-yellow-500"
                            : creditScore >= 600
                              ? "bg-orange-500"
                              : "bg-red-500"
                    }`}
                    style={{ width: `${((creditScore - 300) / 600) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-center font-medium">{getCreditScoreRating()}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() =>
                    speakFinancialInfo(
                      `${t.creditScore.currentScore}: ${creditScore}. ${t.creditScore.tips}: ${t.creditScore.tip1}, ${t.creditScore.tip2}, ${t.creditScore.tip3}.`,
                    )
                  }
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  <span>{t.listenButton || "Listen"}</span>
                </Button>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">{t.creditScore.tips}:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{t.creditScore.tip1}</li>
                  <li>{t.creditScore.tip2}</li>
                  <li>{t.creditScore.tip3}</li>
                  <li>{t.creditScore.tip4}</li>
                  <li>{t.creditScore.tip5}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Planner */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>{t.budgetPlanner.title}</CardTitle>
              <CardDescription>{t.budgetPlanner.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="income">{t.budgetPlanner.income}</Label>
                <Input id="income" type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="housing">{t.budgetPlanner.housing}</Label>
                  <Input
                    id="housing"
                    type="number"
                    value={expenses.housing}
                    onChange={(e) => setExpenses({ ...expenses, housing: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utilities">{t.budgetPlanner.utilities}</Label>
                  <Input
                    id="utilities"
                    type="number"
                    value={expenses.utilities}
                    onChange={(e) => setExpenses({ ...expenses, utilities: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="food">{t.budgetPlanner.food}</Label>
                  <Input
                    id="food"
                    type="number"
                    value={expenses.food}
                    onChange={(e) => setExpenses({ ...expenses, food: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transportation">{t.budgetPlanner.transportation}</Label>
                  <Input
                    id="transportation"
                    type="number"
                    value={expenses.transportation}
                    onChange={(e) => setExpenses({ ...expenses, transportation: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthcare">{t.budgetPlanner.healthcare}</Label>
                  <Input
                    id="healthcare"
                    type="number"
                    value={expenses.healthcare}
                    onChange={(e) => setExpenses({ ...expenses, healthcare: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entertainment">{t.budgetPlanner.entertainment}</Label>
                  <Input
                    id="entertainment"
                    type="number"
                    value={expenses.entertainment}
                    onChange={(e) => setExpenses({ ...expenses, entertainment: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savings">{t.budgetPlanner.savings}</Label>
                  <Input
                    id="savings"
                    type="number"
                    value={expenses.savings}
                    onChange={(e) => setExpenses({ ...expenses, savings: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="other">{t.budgetPlanner.other}</Label>
                  <Input
                    id="other"
                    type="number"
                    value={expenses.other}
                    onChange={(e) => setExpenses({ ...expenses, other: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>{t.budgetPlanner.totalExpenses}:</span>
                  <span className="font-bold">₹{calculateTotalExpenses().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.budgetPlanner.remaining}:</span>
                  <span
                    className={`font-bold ${income - calculateTotalExpenses() >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    ₹{(income - calculateTotalExpenses()).toLocaleString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() =>
                    speakFinancialInfo(
                      `${t.budgetPlanner.totalExpenses}: ${calculateTotalExpenses().toLocaleString()} rupees. 
                    ${t.budgetPlanner.remaining}: ${(income - calculateTotalExpenses()).toLocaleString()} rupees.`,
                    )
                  }
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  <span>{t.listenButton || "Listen"}</span>
                </Button>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">{t.budgetPlanner.budgetChart}:</h4>
                <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex">
                  {Object.entries(expenses).map(([category, amount], index) => {
                    const percentage = (amount / income) * 100
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-yellow-500",
                      "bg-red-500",
                      "bg-purple-500",
                      "bg-pink-500",
                      "bg-indigo-500",
                      "bg-orange-500",
                    ]
                    return (
                      <div
                        key={category}
                        className={`h-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                        title={`${category}: ₹${amount} (${percentage.toFixed(1)}%)`}
                      ></div>
                    )
                  })}
                </div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(expenses).map(([category, amount], index) => {
                    const percentage = (amount / income) * 100
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-yellow-500",
                      "bg-red-500",
                      "bg-purple-500",
                      "bg-pink-500",
                      "bg-indigo-500",
                      "bg-orange-500",
                    ]
                    return (
                      <div key={category} className="flex items-center text-xs">
                        <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-full mr-1`}></div>
                        <span>
                          {t.budgetPlanner[category as keyof typeof t.budgetPlanner] || category}:{" "}
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Market Tracker */}
        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>{t.stockTracker.title}</CardTitle>
              <CardDescription>{t.stockTracker.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t.stockTracker.searchStock}
                    className="pl-8"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Stock Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {filteredStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedStock.symbol === stock.symbol ? "bg-accent" : "hover:bg-muted"}`}
                    onClick={() => setSelectedStock(stock)}
                  >
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div>₹{stock.price}</div>
                      <div className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Stock Details */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{selectedStock.name}</span>
                  <span className="text-xl font-bold">₹{selectedStock.price}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t.stockTracker.dayChange}:</span>
                  <span className={`font-medium ${selectedStock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {selectedStock.change >= 0 ? "+" : ""}
                    {selectedStock.change}% (₹{((selectedStock.price * selectedStock.change) / 100).toFixed(2)})
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{t.stockTracker.marketCap}:</span>
                  <span>₹{selectedStock.marketCap}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t.stockTracker.peRatio}:</span>
                  <span>{selectedStock.peRatio}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t.stockTracker.dividend}:</span>
                  <span>{selectedStock.dividend}%</span>
                </div>

                <div className="mt-2 pt-2 border-t">
                  <div className="font-medium mb-1">{t.stockTracker.recommendation}:</div>
                  <div
                    className={`p-2 rounded ${
                      selectedStock.recommendation === "BUY"
                        ? "bg-green-100 text-green-800"
                        : selectedStock.recommendation === "SELL"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    <strong>{selectedStock.recommendation}</strong> -
                    {selectedStock.recommendation === "BUY"
                      ? " Strong fundamentals with potential for growth over the next 12 months based on expanding business and market position."
                      : selectedStock.recommendation === "SELL"
                        ? " Concerns about valuation and growth prospects suggest caution in the current market environment."
                        : " Current valuation appears fair. Consider holding existing positions but watch for changes in fundamentals."}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() =>
                      speakFinancialInfo(
                        `${selectedStock.name}: ${selectedStock.price} rupees. ${t.stockTracker.dayChange}: ${selectedStock.change}%. ${t.stockTracker.recommendation}: ${selectedStock.recommendation}.`,
                      )
                    }
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    <span>{t.listenButton || "Listen"}</span>
                  </Button>
                </div>
              </div>

              <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                <LineChart className="h-6 w-6 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Stock price chart would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Digital Gold Investment */}
        <TabsContent value="gold">
          <Card>
            <CardHeader>
              <CardTitle>{t.goldInvestment.title}</CardTitle>
              <CardDescription>{t.goldInvestment.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gold-investment-amount">{t.goldInvestment.investmentAmount}</Label>
                <Input
                  id="gold-investment-amount"
                  type="number"
                  value={goldInvestmentAmount}
                  onChange={(e) => setGoldInvestmentAmount(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gold-price">{t.goldInvestment.goldPrice}</Label>
                <Input
                  id="gold-price"
                  type="number"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gold-investment-period">{t.goldInvestment.investmentPeriod}</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="gold-investment-period"
                    min={1}
                    max={20}
                    step={1}
                    value={[goldInvestmentPeriod]}
                    onValueChange={(value) => setGoldInvestmentPeriod(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{goldInvestmentPeriod}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gold-growth-rate">{t.goldInvestment.expectedGrowth}</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="gold-growth-rate"
                    min={1}
                    max={20}
                    step={0.5}
                    value={[goldGrowthRate]}
                    onValueChange={(value) => setGoldGrowthRate(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{goldGrowthRate}%</span>
                </div>
              </div>

              <Button onClick={calculateGoldReturns} className="w-full">
                {t.goldInvestment.calculate}
              </Button>

              {goldResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>{t.goldInvestment.futureValue}:</span>
                    <span className="font-bold">₹{goldResult.futureValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.goldInvestment.quantityInGrams}:</span>
                    <span className="font-bold">{goldResult.quantityInGrams.toLocaleString()} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.goldInvestment.valueGrowth}:</span>
                    <span className="font-bold">₹{goldResult.valueGrowth.toLocaleString()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() =>
                      speakFinancialInfo(
                        `${t.goldInvestment.futureValue}: ${goldResult.futureValue.toLocaleString()} rupees. 
                      ${t.goldInvestment.quantityInGrams}: ${goldResult.quantityInGrams.toLocaleString()} grams. 
                      ${t.goldInvestment.valueGrowth}: ${goldResult.valueGrowth.toLocaleString()} rupees.`,
                      )
                    }
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    <span>{t.listenButton || "Listen"}</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  )
}


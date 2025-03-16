"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CreditCard, BanknoteIcon, PiggyBank, Award, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

interface TopicSelectorProps {
  onTopicSelect: (topic: string) => void
  language: string
}

// Translations for topic titles and descriptions
const translations = {
  english: {
    banking: {
      title: "Banking Topics",
      topics: [
        {
          id: "loans",
          title: "Loan Assistance",
          description: "Learn about loan types, eligibility, and application steps",
          icon: <CreditCard className="h-8 w-8" />,
          details: [
            {
              title: "Personal Loans",
              content:
                "Personal loans are unsecured loans that can be used for various purposes like home renovation, wedding expenses, medical emergencies, etc. They typically have interest rates between 10-18% and loan tenure of 1-5 years. Documents required include ID proof, address proof, income proof, and bank statements.",
              bulletPoints: [
                "Interest rates: 10-18% p.a.",
                "Loan amount: ₹50,000 to ₹40 lakhs",
                "Tenure: 1-5 years",
                "Processing fee: 1-3% of loan amount",
                "Required documents: ID proof, address proof, income proof, bank statements",
              ],
            },
            {
              title: "Home Loans",
              content:
                "Home loans are secured loans used to purchase or construct residential property. They offer lower interest rates compared to personal loans and longer repayment periods. The property serves as collateral for the loan.",
              bulletPoints: [
                "Interest rates: 6.5-9% p.a.",
                "Loan amount: Up to 80% of property value",
                "Tenure: 5-30 years",
                "Processing fee: 0.5-1% of loan amount",
                "Required documents: ID proof, address proof, income proof, property documents",
              ],
            },
            {
              title: "Education Loans",
              content:
                "Education loans help finance higher education in India or abroad. They cover tuition fees, accommodation, and other education-related expenses.",
              bulletPoints: [
                "Interest rates: 7-15% p.a.",
                "Loan amount: Up to ₹75 lakhs for studies abroad",
                "Tenure: 5-15 years",
                "Moratorium period: Course duration + 6-12 months",
                "Required documents: Admission letter, course details, student's and co-applicant's documents",
              ],
            },
          ],
        },
        {
          id: "transactions",
          title: "Money Transactions",
          description: "How to withdraw, deposit, and transfer money securely",
          icon: <BanknoteIcon className="h-8 w-8" />,
          details: [
            {
              title: "NEFT Transfers",
              content:
                "National Electronic Funds Transfer (NEFT) is a nation-wide payment system facilitating one-to-one funds transfer. Under this scheme, individuals can electronically transfer funds from any bank branch to any individual having an account with any other bank branch in the country.",
              bulletPoints: [
                "No minimum or maximum transfer limit",
                "Available 24x7 including holidays",
                "Usually processed within 30 minutes",
                "Charges: Free for online transactions, nominal fee for branch transactions",
                "Requires beneficiary's name, account number, IFSC code, and bank details",
              ],
            },
            {
              title: "IMPS Transfers",
              content:
                "Immediate Payment Service (IMPS) offers an instant, 24x7, interbank electronic fund transfer service through mobile phones, internet banking, and ATMs.",
              bulletPoints: [
                "Transfer limit: Up to ₹5 lakhs",
                "Available 24x7 including holidays",
                "Instant transfer - processed within seconds",
                "Charges: ₹5-15 depending on the amount",
                "Requires beneficiary's name, account number, IFSC code, and bank details",
              ],
            },
            {
              title: "UPI Payments",
              content:
                "Unified Payments Interface (UPI) is a system that powers multiple bank accounts into a single mobile application, merging several banking features, seamless fund routing & merchant payments into one hood.",
              bulletPoints: [
                "Transfer limit: Up to ₹1 lakh per transaction",
                "Available 24x7 including holidays",
                "Instant transfer - processed within seconds",
                "No charges for transactions",
                "Requires UPI ID or QR code of recipient",
              ],
            },
          ],
        },
        // Additional topics would be added here with their details
      ],
    },
    financial: {
      title: "Financial Planning",
      topics: [
        {
          id: "investments",
          title: "Investment Recommendations",
          description: "Personalized investment advice based on your goals",
          icon: <PiggyBank className="h-8 w-8" />,
          details: [
            {
              title: "Fixed Deposits",
              content:
                "Fixed Deposits (FDs) are secure investment options offered by banks where you deposit a lump sum for a fixed period at a predetermined interest rate.",
              bulletPoints: [
                "Interest rates: 5-7% p.a. depending on tenure and bank",
                "Tenure: 7 days to 10 years",
                "Minimum investment: ₹1,000",
                "Risk level: Low",
                "Liquidity: Low (premature withdrawal penalties apply)",
              ],
            },
            {
              title: "Mutual Funds",
              content:
                "Mutual funds pool money from multiple investors to invest in stocks, bonds, and other securities. They are managed by professional fund managers.",
              bulletPoints: [
                "Types: Equity, Debt, Hybrid, Index funds",
                "Returns: 8-15% p.a. (depending on fund type and market conditions)",
                "Minimum investment: ₹500 (SIP), ₹5,000 (lump sum)",
                "Risk level: Low to High (depending on fund type)",
                "Liquidity: Medium to High",
              ],
            },
            {
              title: "Public Provident Fund (PPF)",
              content:
                "PPF is a government-backed long-term savings scheme that offers safety, returns, and tax benefits.",
              bulletPoints: [
                "Interest rate: 7.1% p.a. (subject to quarterly revisions)",
                "Tenure: 15 years (extendable)",
                "Minimum investment: ₹500 per year",
                "Maximum investment: ₹1.5 lakhs per year",
                "Tax benefits: Exempt-Exempt-Exempt (EEE) status",
              ],
            },
          ],
        },
        {
          id: "credit",
          title: "Credit Score Tracking",
          description: "Monitor and improve your credit score",
          icon: <Award className="h-8 w-8" />,
          details: [
            {
              title: "Understanding Credit Score",
              content:
                "A credit score is a three-digit number that represents your creditworthiness. In India, CIBIL score is the most common, ranging from 300 to 900, with higher scores indicating better creditworthiness.",
              bulletPoints: [
                "Excellent score: 750-900",
                "Good score: 700-749",
                "Fair score: 650-699",
                "Poor score: 600-649",
                "Very poor score: 300-599",
              ],
            },
            {
              title: "Factors Affecting Credit Score",
              content: "Several factors influence your credit score, with payment history having the highest impact.",
              bulletPoints: [
                "Payment history (35%): Timely repayment of loans and credit card bills",
                "Credit utilization (30%): Percentage of available credit being used",
                "Credit history length (15%): Duration for which you've had credit",
                "Credit mix (10%): Types of credit (secured, unsecured)",
                "New credit applications (10%): Recent credit inquiries",
              ],
            },
            {
              title: "Improving Credit Score",
              content: "Improving your credit score takes time and discipline. Here are some strategies:",
              bulletPoints: [
                "Pay all bills and EMIs on time",
                "Keep credit utilization below 30%",
                "Don't close old credit accounts",
                "Limit new credit applications",
                "Regularly check your credit report for errors",
              ],
            },
          ],
        },
        // Additional topics would be added here with their details
      ],
    },
  },
  // Additional languages would be added here
}

export default function TopicSelector({ onTopicSelect, language }: TopicSelectorProps) {
  // Get translations for the current language or fallback to English
  const t = translations[language as keyof typeof translations] || translations.english

  // State for the selected topic details dialog
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string
    title: string
    details: Array<{
      title: string
      content: string
      bulletPoints: string[]
    }>
  } | null>(null)

  const handleTopicClick = (topic: any) => {
    if (topic.details) {
      setSelectedTopic({
        id: topic.id,
        title: topic.title,
        details: topic.details,
      })
    } else {
      // If no details, just select the topic
      onTopicSelect(topic.id)
    }
  }

  return (
    <div className="space-y-6 overflow-y-auto">
      <div>
        <h2 className="text-lg font-medium mb-3">{t.banking.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.banking.topics.map((topic) => (
            <Card
              key={topic.id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleTopicClick(topic)}
            >
              <div className="flex items-start gap-4">
                <div className="text-primary">{topic.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">{t.financial.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.financial.topics.map((topic) => (
            <Card
              key={topic.id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleTopicClick(topic)}
            >
              <div className="flex items-start gap-4">
                <div className="text-primary">{topic.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Topic Details Dialog */}
      <Dialog open={!!selectedTopic} onOpenChange={(open) => !open && setSelectedTopic(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedTopic?.title}</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedTopic?.details.map((detail, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-medium">{detail.title}</h3>
                <p>{detail.content}</p>

                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {detail.bulletPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setSelectedTopic(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                onTopicSelect(selectedTopic?.id || "")
                setSelectedTopic(null)
              }}
            >
              Ask About This Topic
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


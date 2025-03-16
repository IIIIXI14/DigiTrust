from typing import Dict, Any, List
import json
import re

class BankingChatbot:
    def __init__(self):
        self.conversation_history = []
        self.intents = {
            'balance': r'(balance|how much.*account)',
            'transfer': r'(transfer|send money)',
            'transaction_history': r'(transactions|spending|history)',
            'bill_pay': r'(pay.*bill|bill.*payment)',
            'account_info': r'(account.*info|details)',
            'help': r'(help|support|assist)'
        }
        self.load_model()

    def load_model(self):
        try:
            # Load any necessary model components from your chatbot
            # This is a placeholder - you'll need to properly integrate your chatbot
            pass
        except Exception as e:
            print(f"Error loading chatbot model: {e}")

    def preprocess_message(self, message: str) -> str:
        # Clean and normalize the input message
        message = message.lower().strip()
        message = re.sub(r'[^\w\s]', '', message)
        return message

    def detect_intent(self, message: str) -> str:
        processed_message = self.preprocess_message(message)
        
        for intent, pattern in self.intents.items():
            if re.search(pattern, processed_message):
                return intent
        
        return 'general'

    def generate_response(self, message: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        try:
            # Process the message
            intent = self.detect_intent(message)
            
            # Update conversation history
            self.conversation_history.append({
                "role": "user",
                "message": message
            })
            
            # Generate response based on intent
            responses = {
                'balance': "I can help you check your balance. Your current balance is [BALANCE]. Would you like to see a breakdown by account?",
                'transfer': "I can help you transfer money. Would you like to make a transfer between your accounts or send money to someone else?",
                'transaction_history': "I can show you your recent transactions. Would you like to see them by category or chronologically?",
                'bill_pay': "I can help you pay bills. Which bill would you like to pay?",
                'account_info': "I can provide your account details. What specific information would you like to know?",
                'help': "I'm here to help! I can assist with checking balances, making transfers, paying bills, and more. What would you like to do?",
                'general': "I'm here to help with your banking needs. Could you please be more specific about what you'd like to do?"
            }
            
            response = responses.get(intent, responses['general'])
            
            # Update conversation history
            self.conversation_history.append({
                "role": "assistant",
                "message": response
            })
            
            return {
                "response": response,
                "intent": intent,
                "confidence": 0.85,
                "requires_auth": intent not in ['help', 'general'],
                "suggested_actions": self.get_suggested_actions(intent)
            }
        except Exception as e:
            print(f"Error generating chatbot response: {e}")
            return {
                "error": str(e),
                "response": "I apologize, but I'm having trouble processing your request. Please try again or contact support if the issue persists.",
                "intent": "error",
                "confidence": 0.0,
                "requires_auth": False,
                "suggested_actions": []
            }

    def get_suggested_actions(self, intent: str) -> List[Dict[str, str]]:
        # Return relevant suggested actions based on the detected intent
        suggestions = {
            'balance': [
                {"text": "View all accounts", "action": "VIEW_ACCOUNTS"},
                {"text": "Download statement", "action": "DOWNLOAD_STATEMENT"}
            ],
            'transfer': [
                {"text": "New transfer", "action": "NEW_TRANSFER"},
                {"text": "View recent transfers", "action": "VIEW_TRANSFERS"}
            ],
            'transaction_history': [
                {"text": "Filter by date", "action": "FILTER_DATE"},
                {"text": "Filter by category", "action": "FILTER_CATEGORY"}
            ],
            'bill_pay': [
                {"text": "View upcoming bills", "action": "VIEW_BILLS"},
                {"text": "Set up autopay", "action": "SETUP_AUTOPAY"}
            ],
            'account_info': [
                {"text": "View account details", "action": "VIEW_DETAILS"},
                {"text": "Update preferences", "action": "UPDATE_PREFERENCES"}
            ],
            'help': [
                {"text": "Contact support", "action": "CONTACT_SUPPORT"},
                {"text": "View FAQs", "action": "VIEW_FAQS"}
            ]
        }
        
        return suggestions.get(intent, [
            {"text": "View all services", "action": "VIEW_SERVICES"},
            {"text": "Contact support", "action": "CONTACT_SUPPORT"}
        ]) 
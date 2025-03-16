"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, StopCircle, Volume2, VolumeX } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LanguageSelector from "./language-selector"
import MessageList from "./message-list"
import TopicSelector from "./topic-selector"
import FinancialTools from "./financial-tools"
import { useToast } from "@/hooks/use-toast"
import ApiKeySetup from "./api-key-setup"
import { isSpeechRecognitionSupported, languageCodes, speakText as speakTextUtil, isSpeechSynthesisSupported } from "@/utils/speech-utils"

// Initial message in different languages
const INITIAL_MESSAGES = {
  english:
    "Hello! I'm your AI finance assistant. How can I help you today with banking, investments, loans, or other financial services?",
  hindi: "नमस्ते! मैं आपका AI वित्त सहायक हूँ। आज मैं आपकी बैंकिंग, निवेश, ऋण, या अन्य वित्तीय सेवाओं में कैसे मदद कर सकता हूँ?",
  marathi: "नमस्कार! मी तुमचा AI वित्त सहाय्यक आहे. आज मी तुम्हाला बँकिंग, गुंतवणूक, कर्ज किंवा इतर आर्थिक सेवांमध्ये कशी मदत करू शकतो?",
  tamil:
    "வணக்கம்! நான் உங்கள் AI நிதி உதவியாளர். இன்று வங்கி, முதலீடு, கடன் அல்லது பிற நிதி சேவைகளில் நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
  malayalam:
    "ഹലോ! ഞാൻ നിങ്ങളുടെ AI ധനകാര്യ സഹായിയാണ്. ബാങ്കിംഗ്, നിക്ഷേപങ്ങൾ, വായ്പകൾ അല്ലെങ്കിൽ മറ്റ് സാമ്പത്തിക സേവനങ്ങൾ എന്നിവയിൽ ഞാൻ ഇന്ന് നിങ്ങളെ എങ്ങനെ സഹായിക്കാൻ കഴിയും?",
  punjabi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਵਿੱਤੀ ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਨੂੰ ਬੈਂਕਿੰਗ, ਨਿਵੇਸ਼, ਕਰਜ਼ੇ, ਜਾਂ ਹੋਰ ਵਿੱਤੀ ਸੇਵਾਵਾਂ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
  bengali:
    "হ্যালো! আমি আপনার AI অর্থনৈতিক সহায়ক। আজ আমি আপনাকে ব্যাংকিং, বিনিয়োগ, ঋণ, বা অন্যান্য আর্থিক পরিষেবাগুলিতে কীভাবে সাহায্য করতে পারি?",
  "agri-koli":
    "नमस्कार! मी तुमचा AI वित्त सहाय्यक आहे. आज मी तुम्हाला बँकिंग, गुंतवणूक, कर्ज किंवा इतर आर्थिक सेवांमध्ये कशी मदत करू शकतो?",
}

// Translations for UI elements
const translations = {
  english: {
    inputPlaceholder: "Type your financial question...",
    sendButton: "Send",
    listenButton: "Listen",
    speakButton: "Speak with AI",
    stopButton: "Stop",
    chatTab: "Chat",
    topicsTab: "Banking Topics",
    toolsTab: "Financial Tools",
    loading: "Loading your finance assistant...",
    voiceCommandsTitle: "Voice Commands",
    voiceCommands: [
      "Show me loan options",
      "Calculate EMI for 10 lakh loan",
      "How to improve credit score",
      "Switch to financial tools",
      "Show me stock market data",
      "Help me create a budget",
    ],
  },
  hindi: {
    inputPlaceholder: "अपना वित्तीय प्रश्न टाइप करें...",
    sendButton: "भेजें",
    listenButton: "सुनें",
    speakButton: "AI से बात करें",
    stopButton: "रोकें",
    chatTab: "चैट",
    topicsTab: "बैंकिंग विषय",
    toolsTab: "वित्तीय उपकरण",
    loading: "आपका वित्त सहायक लोड हो रहा है...",
    voiceCommandsTitle: "वॉयस कमांड",
    voiceCommands: [
      "मुझे लोन विकल्प दिखाएं",
      "10 लाख लोन के लिए EMI की गणना करें",
      "क्रेडिट स्कोर कैसे सुधारें",
      "वित्तीय उपकरणों पर स्विच करें",
      "मुझे शेयर बाजार डेटा दिखाएं",
      "मुझे बजट बनाने में मदद करें",
    ],
  },
  marathi: {
    inputPlaceholder: "तुमचा आर्थिक प्रश्न टाइप करा...",
    sendButton: "पाठवा",
    listenButton: "ऐका",
    speakButton: "AI सोबत बोला",
    stopButton: "थांबा",
    chatTab: "चॅट",
    topicsTab: "बँकिंग विषय",
    toolsTab: "आर्थिक साधने",
    loading: "तुमचा वित्त सहाय्यक लोड होत आहे...",
    voiceCommandsTitle: "व्हॉइस कमांड्स",
    voiceCommands: [
      "मला कर्ज पर्याय दाखवा",
      "10 लाख कर्जासाठी EMI ची गणना करा",
      "क्रेडिट स्कोर कसा सुधारावा",
      "आर्थिक साधनांवर स्विच करा",
      "मला शेअर बाजाराचा डेटा दाखवा",
      "मला बजट तयार करण्यात मदत करा",
    ],
  },
  tamil: {
    inputPlaceholder: "உங்கள் நிதி கேள்வியை தட்டச்சு செய்யவும்...",
    sendButton: "அனுப்பு",
    listenButton: "கேள்",
    speakButton: "AI உடன் பேசு",
    stopButton: "நிறுத்து",
    chatTab: "அரட்டை",
    topicsTab: "வங்கி தலைப்புகள்",
    toolsTab: "நிதி கருவிகள்",
    loading: "உங்கள் நிதி உதவியாளர் ஏற்றப்படுகிறது...",
    voiceCommandsTitle: "குரல் கட்டளைகள்",
    voiceCommands: [
      "கடன் விருப்பங்களைக் காட்டு",
      "10 லட்சம் கடனுக்கான EMI ஐ கணக்கிடு",
      "கடன் மதிப்பெண்ணை எப்படி மேம்படுத்துவது",
      "நிதி கருவிகளுக்கு மாறு",
      "பங்குச் சந்தை தரவைக் காட்டு",
      "பட்ஜெட் உருவாக்க உதவு",
    ],
  },
  malayalam: {
    inputPlaceholder: "നിങ്ങളുടെ സാമ്പത്തിക ചോദ്യം ടൈപ്പ് ചെയ്യുക...",
    sendButton: "അയയ്ക്കുക",
    listenButton: "കേൾക്കുക",
    speakButton: "AI യുമായി സംസാരിക്കുക",
    stopButton: "നിർത്തുക",
    chatTab: "ചാറ്റ്",
    topicsTab: "ബാങ്കിംഗ് വിഷയങ്ങൾ",
    toolsTab: "സാമ്പത്തിക ഉപകരണങ്ങളിലേക്ക് മാറുക",
    loading: "നിങ്ങളുടെ ധനകാര്യ സഹായി ലോഡ് ചെയ്യുന്നു...",
    voiceCommandsTitle: "വോയ്സ് കമാൻഡുകൾ",
    voiceCommands: [
      "വായ്പാ ഓപ്ഷനുകൾ കാണിക്കുക",
      "10 ലക്ഷം വായ്പയ്ക്കുള്ള EMI കണക്കാക്കുക",
      "ക്രെഡിറ്റ് സ്കോർ എങ്ങനെ മെച്ചപ്പെടുത്താം",
      "സാമ്പത്തിക ഉപകരണങ്ങളിലേക്ക് മാറുക",
      "ഓഹരി വിപണി ഡാറ്റ കാണിക്കുക",
      "ബജറ്റ് തയ്യാറാക്കാൻ സഹായിക്കുക",
    ],
  },
  punjabi: {
    inputPlaceholder: "ਆਪਣਾ ਵਿੱਤੀ ਸਵਾਲ ਟਾਈਪ ਕਰੋ...",
    sendButton: "ਭੇਜੋ",
    listenButton: "ਸੁਣੋ",
    speakButton: "AI ਨਾਲ ਗੱਲ ਕਰੋ",
    stopButton: "ਰੋਕੋ",
    chatTab: "ਚੈਟ",
    topicsTab: "ਬੈਂਕਿੰਗ ਵਿਸ਼ੇ",
    toolsTab: "ਵਿੱਤੀ ਸਾਧਨ",
    loading: "ਤੁਹਾਡਾ ਵਿੱਤੀ ਸਹਾਇਕ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    voiceCommandsTitle: "ਵੌਇਸ ਕਮਾਂਡਾਂ",
    voiceCommands: [
      "ਮੈਨੂੰ ਲੋਨ ਵਿਕਲਪ ਦਿਖਾਓ",
      "10 ਲੱਖ ਲੋਨ ਲਈ EMI ਦੀ ਗਣਨਾ ਕਰੋ",
      "ਕ੍ਰੈਡਿਟ ਸਕੋਰ ਕਿਵੇਂ ਸੁਧਾਰੀਏ",
      "ਵਿੱਤੀ ਸਾਧਨਾਂ 'ਤੇ ਸਵਿੱਚ ਕਰੋ",
      "ਮੈਨੂੰ സਟਾക് മാര്ക്കിട് ഡാറ്റ ദിഖിക്കുക",
      "ബജറ്റ് തയ്യാറാക്കാൻ സഹായിക്കുക",
    ],
  },
  bengali: {
    inputPlaceholder: "আপনার আর্থিক প্রশ্ন টাইপ করুন...",
    sendButton: "পাঠান",
    listenButton: "শুনুন",
    speakButton: "AI এর সাথে কথা বলুন",
    stopButton: "থামুন",
    chatTab: "চ্যাট",
    topicsTab: "ব্যাংকিং বিষয়",
    toolsTab: "আর্থিক টুলস",
    loading: "আপনার আর্থিক সহায়ক লোড হচ্ছে...",
    voiceCommandsTitle: "ভয়েস কমান্ড",
    voiceCommands: [
      "আমাকে ঋণের বিকল্পগুলি দেখান",
      "10 লাখ ঋণের জন্য EMI গণনা করুন",
      "ক্রেডিট স্কোর কীভাবে উন্নত করা যায়",
      "আর্থিক টুলসে স্যুইচ করুন",
      "আমাকে স্টক মার্কেট ডেটা দেখান",
      "বাজেট তৈরি করতে সাহায্য করুন",
    ],
  },
  "agri-koli": {
    inputPlaceholder: "तुमचा आर्थिक प्रश्न टाइप करा...",
    sendButton: "पाठवा",
    listenButton: "ऐका",
    speakButton: "AI सोबत बोला",
    stopButton: "थांबा",
    chatTab: "गप्पा",
    topicsTab: "बँकेचे विषय",
    toolsTab: "पैशाची साधनं",
    loading: "तुमचा पैशाचा मदतनीस लोड होतोय...",
    voiceCommandsTitle: "आवाजाच्या आज्ञा",
    voiceCommands: [
      "मला कर्जाचे पर्याय दाखवा",
      "10 लाख कर्जासाठी EMI ची गणना करा",
      "क्रेडिट स्कोर कसा सुधारावा",
      "पैशाच्या साधनांवर जा",
      "मला शेअर बाजाराची माहिती दाखवा",
      "मला अंदाजपत्रक बनवायला मदत करा",
    ],
  },
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("english")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Speech recognition reference
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize messages
    setMessages([
      {
        role: "assistant" as const,
        content: INITIAL_MESSAGES[currentLanguage as keyof typeof INITIAL_MESSAGES] || INITIAL_MESSAGES.english,
      },
    ])

    // Initialize speech recognition
    if (isSpeechRecognitionSupported()) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = languageCodes[currentLanguage] || "en-US"

        recognitionRef.current.onresult = (event: any) => {
          try {
            const transcript = event.results[0][0].transcript
            setInput(transcript)

            // Auto-submit if it's a command
            if (
              transcript.toLowerCase().includes("switch to") ||
              transcript.toLowerCase().includes("show me") ||
              transcript.toLowerCase().includes("go to")
            ) {
              // Handle navigation commands
              if (transcript.toLowerCase().includes("financial tools") || transcript.toLowerCase().includes("tools")) {
                setActiveTab("tools")
              } else if (
                transcript.toLowerCase().includes("banking topics") ||
                transcript.toLowerCase().includes("topics")
              ) {
                setActiveTab("topics")
              } else if (transcript.toLowerCase().includes("chat")) {
                setActiveTab("chat")
              } else {
                // If not a navigation command, submit as a question
                setTimeout(() => handleSend(), 500)
              }
            } else {
              // Auto-submit regular questions
              setTimeout(() => handleSend(), 500)
            }
          } catch (error) {
            console.error("Error processing speech result:", error)
            toast({
              title: "Speech Recognition Error",
              description: "Failed to process speech input. Please try again.",
              variant: "destructive",
            })
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event)
          setIsRecording(false)
          if (event.error === "not-allowed") {
            toast({
              title: "Microphone Access Denied",
              description: "Please allow microphone access to use voice input.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Voice Recognition Error",
              description: `Failed to recognize speech. Please try again.`,
              variant: "destructive",
            })
          }
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      } catch (error) {
        console.error("Error initializing speech recognition:", error)
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null
          recognitionRef.current.onerror = null
          recognitionRef.current.onend = null
        } catch (error) {
          console.error("Error cleaning up speech recognition:", error)
        }
      }

      if (window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel()
        } catch (error) {
          console.error("Error canceling speech synthesis:", error)
        }
      }
    }
  }, [currentLanguage, toast])

  const speakText = async (text: string) => {
    if (!isSpeechSynthesisSupported()) {
      toast({
        title: "Text-to-Speech Unavailable",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive",
      })
      return
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      setIsSpeaking(true)

      await speakTextUtil(
        text,
        currentLanguage,
        () => {
          setIsSpeaking(false)
        },
        (error) => {
          console.error("Speech synthesis error:", error)
          setIsSpeaking(false)
          toast({
            title: "Text-to-Speech Error",
            description: `Failed to speak in ${currentLanguage}. Falling back to English.`,
            variant: "destructive",
          })
          
          // Fallback to English if the selected language fails
          if (currentLanguage !== "english") {
            speakTextUtil(
              text,
              "english",
              () => setIsSpeaking(false),
              (error) => {
                console.error("Fallback speech synthesis error:", error)
                setIsSpeaking(false)
                toast({
                  title: "Text-to-Speech Error",
                  description: "Failed to speak the text. Please try again.",
                  variant: "destructive",
                })
              }
            )
          }
        }
      )
    } catch (error) {
      console.error("Error in text-to-speech:", error)
      setIsSpeaking(false)
      toast({
        title: "Text-to-Speech Error",
        description: "An error occurred while trying to speak the text.",
        variant: "destructive",
      })
    }
  }

  const handleSend = async () => {
    if (input.trim() === "") return

    const userMessage: Message = { 
      role: "user" as const, 
      content: input 
    }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      conversationHistory.push({
        role: "user" as const,
        content: input,
      })

      const systemPrompt = `You are a helpful, friendly AI finance assistant specializing in banking, investments, loans, and financial planning. 
      Provide detailed, accurate information about financial topics. 
      ${currentLanguage !== "english" ? `Respond in ${currentLanguage} language.` : ""}
      Keep responses concise but informative. If you don't know something, admit it rather than making up information.`

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory,
          systemPrompt,
          language: currentLanguage,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiResponse: Message = { 
        role: "assistant" as const, 
        content: data.text 
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (error: any) {
      console.error("Error in chat:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle language change for speech recognition
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = languageCodes[currentLanguage] || "en-US"
    }
  }, [currentLanguage])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      })
      return
    }

    if (isRecording) {
      // Stop recording
      window.speechSynthesis.cancel()
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      setIsRecording(false)
    } else {
      // Start recording
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start()
          setIsRecording(true)

          toast({
            title: "Voice Recording Started",
            description: `Listening in ${currentLanguage}...`,
            duration: 2000,
          })
        } else {
          toast({
            title: "Voice Recognition Not Available",
            description: "Speech recognition is not properly initialized.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        setIsRecording(false)

        toast({
          title: "Voice Recognition Error",
          description: "Could not start voice recognition. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      // Start conversation mode
      setIsSpeaking(true)

      // Speak the last assistant message
      const lastAssistantMessage = [...messages].reverse().find((msg) => msg.role === "assistant")
      if (lastAssistantMessage) {
        speakText(lastAssistantMessage.content)
      }

      toast({
        title: "Voice Conversation Mode",
        description: `AI will now speak responses in ${currentLanguage}`,
        duration: 3000,
      })
    }
  }

  const playLastResponse = () => {
    const lastAssistantMessage = [...messages].reverse().find((msg) => msg.role === "assistant")
    if (lastAssistantMessage) {
      speakText(lastAssistantMessage.content)
    } else {
      toast({
        title: "No Message to Play",
        description: "There is no assistant message to play.",
        variant: "destructive",
      })
    }
  }

  const handleTopicSelect = (topic: string) => {
    const topicQuestions: Record<string, string> = {
      loans: "What types of loans are available and what documents do I need?",
      transactions: "How do I transfer money to another account securely?",
      accounts: "How do I open a new savings account with the best interest rate?",
      atm: "How do I withdraw money from an ATM and what are the daily limits?",
      forms: "What forms do I need to fill for a fixed deposit and how to calculate returns?",
      policies: "What are the current interest rates for savings accounts and fixed deposits?",
      investments: "What are the best investment options for a 5-year horizon with moderate risk?",
      budget: "How can I create a monthly budget to save more money?",
      credit: "How can I check and improve my credit score?",
      debt: "What's the best strategy to pay off multiple loans?",
      insurance: "Which health insurance policy is best for my family?",
      stocks: "How should I start investing in the stock market as a beginner?",
      gold: "Is digital gold a good investment option right now?",
      tax: "How can I save taxes through investments?",
      fraud: "How can I protect myself from online banking fraud?",
    }

    setInput(topicQuestions[topic] || "")
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Switch to chat tab
    setActiveTab("chat")
  }

  // Get translations for the current language
  const t = translations[currentLanguage as keyof typeof translations] || translations.english

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
          <ApiKeySetup />
        </div>
        <div className="flex gap-2">
          <Button
            variant={isSpeaking ? "destructive" : "outline"}
            size="sm"
            onClick={toggleSpeaking}
            className="flex items-center gap-1"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-4 w-4" />
                <span className="hidden sm:inline">{t.stopButton}</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t.speakButton}</span>
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={playLastResponse} className="flex items-center gap-1">
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t.listenButton}</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="chat">{t.chatTab}</TabsTrigger>
          <TabsTrigger value="topics">{t.topicsTab}</TabsTrigger>
          <TabsTrigger value="tools">{t.toolsTab}</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <Card className="flex-1 p-4 overflow-y-auto mb-4">
            <MessageList
              messages={messages}
              isLoading={isLoading}
              language={currentLanguage}
              onPlayMessage={speakText}
            />
            <div ref={bottomRef} />
          </Card>

          <div className="flex items-center gap-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={toggleRecording}
              className={isRecording ? "bg-red-100 text-red-500" : ""}
            >
              {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleSend}
              placeholder={t.inputPlaceholder}
              className="flex-1"
            />

            <Button onClick={handleSend} disabled={input.trim() === "" || isLoading} size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </div>

          {/* Voice Commands Help */}
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <h3 className="font-medium mb-1">{t.voiceCommandsTitle}:</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {t.voiceCommands.map((command, index) => (
                <div key={index} className="flex items-center">
                  <Mic className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>{command}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="topics" className="flex-1">
          <TopicSelector onTopicSelect={handleTopicSelect} language={currentLanguage} />
        </TabsContent>

        <TabsContent value="tools" className="flex-1">
          <FinancialTools language={currentLanguage} />
        </TabsContent>
      </Tabs>
    </div>
  )
}


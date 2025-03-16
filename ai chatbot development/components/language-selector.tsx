"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Languages } from "lucide-react"
import { useEffect } from "react"
import { languageCodes } from "@/utils/speech-utils"

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

const languages = [
  { value: "english", label: "English" },
  { value: "hindi", label: "हिंदी (Hindi)" },
  { value: "marathi", label: "मराठी (Marathi)" },
  { value: "tamil", label: "தமிழ் (Tamil)" },
  { value: "malayalam", label: "മലയാളം (Malayalam)" },
  { value: "punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { value: "bengali", label: "বাংলা (Bengali)" },
  { value: "agri-koli", label: "अग्री-कोळी (Agri-Koli)" },
]

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  // Check if the browser supports the selected language for speech
  useEffect(() => {
    const checkLanguageSupport = () => {
      if ("speechSynthesis" in window) {
        const voices = window.speechSynthesis.getVoices()
        const langCode = languageCodes[currentLanguage] || "en-US"
        const langPrefix = langCode.split("-")[0]

        // Check if there's a voice that supports the selected language
        const hasVoice = voices.some((voice) => voice.lang === langCode || voice.lang.startsWith(langPrefix))

        if (!hasVoice && currentLanguage !== "english") {
          console.warn(`No voice found for ${currentLanguage} (${langCode}). Using fallback.`)
        }
      }
    }

    // Check immediately if voices are already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      checkLanguageSupport()
    } else {
      // Otherwise wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = checkLanguageSupport
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [currentLanguage])

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              {language.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}


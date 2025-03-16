import { Loader2 } from "lucide-react"

interface LoadingUIProps {
  language?: string
}

// Translations for loading text
const translations = {
  english: "Loading your finance assistant...",
  hindi: "आपका वित्त सहायक लोड हो रहा है...",
  marathi: "तुमचा वित्त सहाय्यक लोड होत आहे...",
  tamil: "உங்கள் நிதி உதவியாளர் ஏற்றப்படுகிறது...",
  // Additional languages would be added here
}

export default function LoadingUI({ language = "english" }: LoadingUIProps) {
  const loadingText = translations[language as keyof typeof translations] || translations.english

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">{loadingText}</p>
    </div>
  )
}


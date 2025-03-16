// This is a mock translation service that would be replaced with a real API in production
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  // In a real implementation, this would call a translation API
  // For demo purposes, we'll return the original text
  console.log(`Translating to ${targetLanguage}: ${text}`)
  return text
}

// Language codes for speech recognition and synthesis
export const languageCodes: Record<string, string> = {
  english: "en-US",
  hindi: "hi-IN",
  marathi: "mr-IN",
  tamil: "ta-IN",
  malayalam: "ml-IN",
  punjabi: "pa-IN",
  bengali: "bn-IN",
  "agri-koli": "mr-IN", // Fallback to Marathi for Agri-Koli
}

// Check if browser supports speech recognition
export function isSpeechRecognitionSupported(): boolean {
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window
}

// Check if browser supports speech synthesis
export function isSpeechSynthesisSupported(): boolean {
  return "speechSynthesis" in window
}

// Get available voices for a specific language
export function getVoicesForLanguage(languageCode: string): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return []

  const allVoices = window.speechSynthesis.getVoices()
  return allVoices.filter((voice) => voice.lang.startsWith(languageCode.split("-")[0]))
}


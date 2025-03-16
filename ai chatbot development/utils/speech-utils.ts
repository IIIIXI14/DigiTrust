// Speech utility functions for multilingual support

// Language codes mapping for speech recognition and synthesis
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

// Wait for voices to be loaded
export function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
      return
    }

    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices()
      resolve(voices)
    }
  })
}

// Get available voices for a specific language
export async function getVoicesForLanguage(languageCode: string): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSynthesisSupported()) return []

  const voices = await waitForVoices()
  const langPrefix = languageCode.split("-")[0]
  
  return voices.filter((voice) => {
    // Check for exact match or language prefix match
    return voice.lang === languageCode || voice.lang.startsWith(langPrefix)
  })
}

// Get the best voice for a language (with intelligent fallbacks)
export async function getBestVoiceForLanguage(language: string): Promise<SpeechSynthesisVoice | null> {
  if (!isSpeechSynthesisSupported()) return null

  const langCode = languageCodes[language] || "en-US"
  const voices = await waitForVoices()
  const langPrefix = langCode.split("-")[0]

  // Try to find the best match in this order:
  // 1. Exact match for language code
  // 2. Match for language prefix
  // 3. Google or Microsoft voice for the language
  // 4. Any voice for the language
  // 5. Fallback to Hindi for Indian languages
  // 6. Fallback to English

  // 1. Exact match
  let voice = voices.find((v) => v.lang === langCode)
  if (voice) return voice

  // 2. Language prefix match
  voice = voices.find((v) => v.lang.startsWith(langPrefix))
  if (voice) return voice

  // 3. Google or Microsoft voice for the language
  voice = voices.find(
    (v) =>
      (v.name.includes("Google") || v.name.includes("Microsoft")) &&
      v.lang.startsWith(langPrefix)
  )
  if (voice) return voice

  // 4. Any voice for the language
  voice = voices.find((v) => v.lang.startsWith(langPrefix))
  if (voice) return voice

  // 5. Fallback to Hindi for Indian languages
  if (language !== "english") {
    voice = voices.find((v) => v.lang === "hi-IN" || v.lang.startsWith("hi"))
    if (voice) return voice
  }

  // 6. Final fallback to English
  return voices.find((v) => v.lang === "en-US") || voices[0] || null
}

// Initialize speech synthesis with the correct voice
export async function initializeSpeechSynthesis(language: string): Promise<SpeechSynthesisUtterance> {
  const utterance = new SpeechSynthesisUtterance()
  
  // Set initial language code
  utterance.lang = languageCodes[language] || "en-US"

  try {
    // Get the best available voice
    const voice = await getBestVoiceForLanguage(language)
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang // Use the voice's language code
    }

    // Adjust speech parameters based on language
    utterance.rate = language === "english" ? 1.0 : 0.9 // Slightly slower for Indian languages
    utterance.pitch = 1.0
    utterance.volume = 1.0
  } catch (error) {
    console.error("Error initializing speech synthesis:", error)
  }

  return utterance
}

// Speak text with proper language support
export async function speakText(
  text: string,
  language: string,
  onEnd?: () => void,
  onError?: (error: any) => void
): Promise<void> {
  if (!isSpeechSynthesisSupported()) {
    if (onError) onError(new Error("Speech synthesis not supported"))
    return
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Create and configure utterance
    const utterance = await initializeSpeechSynthesis(language)
    utterance.text = text

    // Set callbacks
    if (onEnd) utterance.onend = onEnd
    if (onError) utterance.onerror = onError

    // Add error handling for unsupported languages
    if (!utterance.voice) {
      console.warn(`No voice found for language: ${language}, falling back to default`)
    }

    // Chrome bug workaround: reset synthesis if it gets stuck
    const resetTimeout = setTimeout(() => {
      window.speechSynthesis.pause()
      window.speechSynthesis.resume()
    }, 10000)

    utterance.onend = () => {
      clearTimeout(resetTimeout)
      if (onEnd) onEnd()
    }

    utterance.onerror = (event) => {
      clearTimeout(resetTimeout)
      console.error("Speech synthesis error:", event)
      if (onError) onError(event)
    }

    // Start speaking
    window.speechSynthesis.speak(utterance)
  } catch (error) {
    console.error("Error in speakText:", error)
    if (onError) onError(error)
  }
}


import { NextResponse } from "next/server"
import OpenAI from "openai"

// Language prompts for better translation
const languagePrompts: Record<string, string> = {
  english: "You are a helpful finance assistant. Respond in English.",
  hindi: "आप एक सहायक वित्त सहायक हैं। हिंदी में जवाब दें।",
  marathi: "तुम्ही एक मदतगार वित्तीय सहाय्यक आहात. मराठीत उत्तर द्या.",
  tamil: "நீங்கள் உதவிகரமான நிதி உதவியாளர். தமிழில் பதிலளிக்கவும்.",
  malayalam: "നിങ്ങൾ ഒരു സഹായകരമായ ധനകാര്യ സഹായി ആണ്. മലയാളത്തിൽ മറുപടി നൽകുക.",
  punjabi: "ਤੁਸੀਂ ਇੱਕ ਮਦਦਗਾਰ ਵਿੱਤੀ ਸਹਾਇਕ ਹੋ। ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।",
  bengali: "আপনি একজন সহায়ক অর্থনৈতিক সহকারী। বাংলায় উত্তর দিন।",
  "agri-koli": "तुम्ही एक मदतगार वित्तीय सहाय्यक आहात. अग्री-कोळी भाषेत उत्तर द्या."
}

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt, language } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured")
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format", messages)
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      )
    }

    // Generate response using OpenAI
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `${languagePrompts[language] || languagePrompts.english}
            ${systemPrompt ? `\nAdditional context: ${systemPrompt}` : ""}
            Important instructions:
            1. Always respond in ${language} language only
            2. Use appropriate financial terms in ${language}
            3. Keep the language natural and conversational
            4. If you don't know something, admit it in ${language}
            5. For numbers and calculations, use the local number format when appropriate`
          },
          ...messages
        ]
      })

      if (!completion.choices[0]?.message?.content) {
        console.error("No response content from OpenAI")
        return NextResponse.json(
          { error: "Failed to generate response content" },
          { status: 500 }
        )
      }

      // Return the response
      return NextResponse.json({ 
        text: completion.choices[0].message.content 
      })
    } catch (openaiError: any) {
      console.error("OpenAI API Error:", openaiError.message)
      return NextResponse.json(
        { error: `OpenAI API Error: ${openaiError.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("General Error in chat API:", error)
    return NextResponse.json(
      { error: `Failed to process request: ${error.message}` },
      { status: 500 }
    )
  }
}


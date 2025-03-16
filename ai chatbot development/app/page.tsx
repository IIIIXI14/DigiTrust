import { Suspense } from "react"
import ChatInterface from "@/components/chat-interface"
import LoadingUI from "@/components/loading-ui"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col h-screen">
        <header className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-primary">AI Finance Assistant</h1>
          <p className="text-center text-muted-foreground">Your multilingual banking and financial planning guide</p>
        </header>

        <Suspense fallback={<LoadingUI />}>
          <ChatInterface />
        </Suspense>
      </div>
    </main>
  )
}


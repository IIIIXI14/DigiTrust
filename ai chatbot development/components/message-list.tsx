"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2, Volume2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  language: string
  onPlayMessage?: (text: string) => void
}

export default function MessageList({ messages, isLoading, language, onPlayMessage }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={index} className={cn("flex items-start gap-3 max-w-[85%]", message.role === "user" ? "ml-auto" : "")}>
          {message.role === "assistant" && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          )}

          <div
            className={cn(
              "rounded-lg px-4 py-2 text-sm group relative",
              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
            )}
          >
            {message.content}

            {message.role === "assistant" && onPlayMessage && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute -right-7 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onPlayMessage(message.content)}
                aria-label={`Play message in ${language}`}
              >
                <Volume2 className="h-3 w-3" />
                <span className="sr-only">Play message</span>
              </Button>
            )}
          </div>

          {message.role === "user" && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="rounded-lg px-4 py-2 bg-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </div>
      )}
    </div>
  )
}


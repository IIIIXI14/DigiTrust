"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Send, Mic, Image } from "lucide-react";

export default function AIAssistant() {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Handle sending message
    setMessage("");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 p-4 shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">AI Assistant</Label>
          <Button variant="ghost" size="icon">
            <Image className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-64 overflow-y-auto rounded-md border bg-muted/50 p-4">
          {/* Chat messages will go here */}
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <div className="h-6 w-6 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">AI Assistant</p>
                <div className="mt-1 rounded-lg bg-primary/10 p-2">
                  <p className="text-sm">How can I help you today?</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? "text-red-500" : ""}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
} 
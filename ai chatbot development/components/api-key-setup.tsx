"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle } from "lucide-react"

// Use the provided API key
const OPENAI_API_KEY =
  "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"

export default function ApiKeySetup() {
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState(OPENAI_API_KEY)
  const [isSaving, setIsSaving] = useState(false)
  const [isConfigured, setIsConfigured] = useState(true) // Set to true since we have a key

  const saveApiKey = async () => {
    if (!apiKey.trim()) return

    setIsSaving(true)

    try {
      // In a real app, this would securely store the API key
      // For demo purposes, we'll just simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Close the dialog
      setIsOpen(false)
      setIsConfigured(true)

      // In a real app, you would refresh the page or update state
      window.location.reload()
    } catch (error) {
      console.error("Error saving API key:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="flex items-center gap-1">
        {isConfigured ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4" />}
        <span>API Key {isConfigured ? "Configured" : "Setup"}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenAI API Key</DialogTitle>
            <DialogDescription>
              Your OpenAI API key is configured and ready to use. You can update it if needed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input type="password" placeholder="sk-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              <p className="text-xs text-muted-foreground">
                You can get your API key from the{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  OpenAI dashboard
                </a>
                .
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveApiKey} disabled={!apiKey.trim() || isSaving}>
              {isSaving ? "Saving..." : "Save API Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Bot, Send, User, Sparkles, Loader2, X } from 'lucide-react'
import type { Project } from '@/lib/types'

interface ProjectAssistantProps {
  project: Project
  isOpen: boolean
  onClose: () => void
}

export function ProjectAssistant({ project, isOpen, onClose }: ProjectAssistantProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentStep = project.steps.find(s => !s.completed) || project.steps[0]

  const context = {
    projectName: project.name,
    projectType: project.type,
    projectGoal: project.goal,
    currentStep: currentStep ? {
      number: currentStep.number,
      title: currentStep.title,
      description: currentStep.description,
      instructions: currentStep.instructions,
      successCriteria: currentStep.successCriteria,
      requirements: currentStep.requirements,
    } : null,
    totalSteps: project.steps.length,
    completedSteps: project.steps.filter(s => s.completed).length,
    programs: project.resources.programs.map(p => ({
      name: p.name,
      installed: p.installed,
      purpose: p.purpose,
    })),
    accounts: project.resources.accounts.map(a => ({
      service: a.service,
      created: a.created,
      purpose: a.purpose,
    })),
  }

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/assistant',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          messages,
          context,
        },
      }),
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="bg-card border-border shadow-xl">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-accent" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="h-[350px] overflow-y-auto space-y-3 pr-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Sparkles className="w-10 h-10 text-accent mb-3 opacity-60" />
                <p className="text-muted-foreground text-sm mb-2">
                  I know everything about your project.
                </p>
                <p className="text-muted-foreground text-xs">
                  Ask me anything - what to do next, how to get started, or any questions.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === 'text') {
                        return (
                          <div 
                            key={index} 
                            className="whitespace-pre-wrap prose prose-sm prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMessage(part.text) 
                            }}
                          />
                        )
                      }
                      return null
                    })}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-secondary rounded-lg px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-secondary border-border"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isLoading}
              className="bg-accent hover:bg-accent/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function formatMessage(text: string): string {
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="bg-background/50 rounded p-2 my-2 overflow-x-auto"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-background/50 px-1 rounded">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-accent underline">$1</a>')
    .replace(/\n/g, '<br />')
}

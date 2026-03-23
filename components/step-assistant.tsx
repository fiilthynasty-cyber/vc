'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Bot, Send, User, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Project, Step } from '@/lib/types'

interface StepAssistantProps {
  project: Project
  step: Step
}

export function StepAssistant({ project, step }: StepAssistantProps) {
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const context = {
    projectName: project.name,
    projectType: project.type,
    projectGoal: project.goal,
    currentStep: {
      number: step.number,
      title: step.title,
      description: step.description,
      instructions: step.instructions,
      successCriteria: step.successCriteria,
      requirements: step.requirements,
    },
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

  const quickPrompts = [
    "Walk me through this step",
    "What do I need to do first?",
    "I'm stuck, help me",
    "What does this mean?",
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader 
        className="pb-3 cursor-pointer flex flex-row items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="w-5 h-5 text-accent" />
          AI Assistant
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Sparkles className="w-10 h-10 text-accent mb-3 opacity-60" />
                <p className="text-muted-foreground text-sm mb-4">
                  Ask me anything about this step. I'll guide you through it.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickPrompts.map((prompt, i) => (
                    <Button
                      key={i}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setInput(prompt)
                      }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
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
              placeholder="Ask anything about this step..."
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
      )}
    </Card>
  )
}

// Simple markdown-like formatting
function formatMessage(text: string): string {
  return text
    // Code blocks
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="bg-background/50 rounded p-2 my-2 overflow-x-auto"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-background/50 px-1 rounded">$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-accent underline">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br />')
}

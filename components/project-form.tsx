'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Code, Rocket, Palette, GraduationCap, ArrowRight, Sparkles } from 'lucide-react'
import type { ProjectType } from '@/lib/types'

const PROJECT_TYPES: { type: ProjectType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'software', label: 'Software', icon: <Code className="w-5 h-5" />, description: 'Apps, websites, tools' },
  { type: 'startup', label: 'Business', icon: <Rocket className="w-5 h-5" />, description: 'Startups, products, launches' },
  { type: 'creative', label: 'Creative', icon: <Palette className="w-5 h-5" />, description: 'Design, video, content' },
  { type: 'learning', label: 'Learning', icon: <GraduationCap className="w-5 h-5" />, description: 'Courses, tutorials, skills' },
]

interface ProjectFormProps {
  onSubmit: (data: { name: string; type: ProjectType; goal: string }) => Promise<void>
  isLoading?: boolean
}

export function ProjectForm({ onSubmit, isLoading = false }: ProjectFormProps) {
  const [name, setName] = useState('')
  const [selectedType, setSelectedType] = useState<ProjectType>('software')
  const [goal, setGoal] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !goal.trim()) return
    await onSubmit({ name: name.trim(), type: selectedType, goal: goal.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Project Name */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Project Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Project"
          className="bg-card border-border h-12 text-base"
          disabled={isLoading}
        />
      </div>

      {/* Project Type Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Project Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PROJECT_TYPES.map(({ type, label, icon, description }) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              disabled={isLoading}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedType === type
                  ? 'bg-accent/10 border-accent text-foreground'
                  : 'bg-card border-border text-muted-foreground hover:border-accent/50'
              }`}
            >
              <div className={`mb-2 ${selectedType === type ? 'text-accent' : ''}`}>
                {icon}
              </div>
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-muted-foreground mt-1">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Project Goal */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Describe Your Goal</label>
        <Textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Tell me what you want to build or achieve. Be specific about features, requirements, and what success looks like..."
          className="bg-card border-border min-h-[160px] text-base resize-none"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          The more detail you provide, the better the AI can plan your project.
        </p>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full gap-2"
        disabled={!name.trim() || !goal.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            Generating Plan...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Project Plan
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  )
}

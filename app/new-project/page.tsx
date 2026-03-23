'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProjectForm } from '@/components/project-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Layers } from 'lucide-react'
import type { Project, ProjectType } from '@/lib/types'
import { saveProject, generateId } from '@/lib/storage'

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: { name: string; type: ProjectType; goal: string }) => {
    setIsLoading(true)
    
    try {
      // Call the AI to generate the plan
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate plan')
      }
      
      const plan = await response.json()
      
      // Create the project with the generated plan
      const project: Project = {
        id: generateId(),
        name: data.name,
        type: data.type,
        goal: data.goal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        steps: plan.steps,
        resources: plan.resources,
        currentStepIndex: 0,
        status: 'planning',
      }
      
      saveProject(project)
      router.push(`/projects/${project.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-accent" />
          <span className="font-semibold text-lg">Command Center</span>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Create New Project</h1>
          <p className="text-muted-foreground text-lg">
            Tell me what you want to build and I&apos;ll generate a complete plan with all the steps, 
            tools, and accounts you&apos;ll need.
          </p>
        </div>

        <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </main>
  )
}

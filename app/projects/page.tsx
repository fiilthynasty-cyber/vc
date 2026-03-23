'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { Layers, Plus, Code, Rocket, Palette, GraduationCap, ArrowRight, Trash2 } from 'lucide-react'
import { getProjects, deleteProject } from '@/lib/storage'
import type { Project, ProjectType } from '@/lib/types'

const TYPE_ICONS: Record<ProjectType, React.ReactNode> = {
  software: <Code className="w-4 h-4" />,
  startup: <Rocket className="w-4 h-4" />,
  creative: <Palette className="w-4 h-4" />,
  learning: <GraduationCap className="w-4 h-4" />,
}

const TYPE_LABELS: Record<ProjectType, string> = {
  software: 'Software',
  startup: 'Business',
  creative: 'Creative',
  learning: 'Learning',
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setProjects(getProjects())
    setIsLoaded(true)
  }, [])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id)
      setProjects(getProjects())
    }
  }

  const getProgress = (project: Project) => {
    if (project.steps.length === 0) return 0
    const completed = project.steps.filter(s => s.completed).length
    return Math.round((completed / project.steps.length) * 100)
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-background">
        <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-accent" />
            <span className="font-semibold text-lg">Command Center</span>
          </Link>
        </header>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-accent" />
          <span className="font-semibold text-lg">Command Center</span>
        </Link>
        <Link href="/new-project">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Projects</h1>

        {projects.length === 0 ? (
          <Empty className="py-16">
            <EmptyMedia variant="icon">
              <Layers className="w-6 h-6" />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create your first project to get started with AI-powered planning.
            </EmptyDescription>
            <EmptyContent>
              <Link href="/new-project">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Project
                </Button>
              </Link>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid gap-4">
            {projects.map(project => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="bg-card border-border hover:border-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="gap-1.5">
                            {TYPE_ICONS[project.type]}
                            {TYPE_LABELS[project.type]}
                          </Badge>
                          <Badge 
                            variant={project.status === 'completed' ? 'default' : 'outline'}
                            className={project.status === 'completed' ? 'bg-success text-success-foreground' : ''}
                          >
                            {project.status === 'in-progress' ? 'In Progress' : 
                             project.status === 'completed' ? 'Completed' : 'Planning'}
                          </Badge>
                        </div>
                        <h2 className="text-xl font-semibold mb-1 truncate">{project.name}</h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.goal}</p>
                        
                        {/* Progress */}
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent transition-all"
                              style={{ width: `${getProgress(project)}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {getProgress(project)}% complete
                          </span>
                        </div>
                        
                        {/* Stats */}
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{project.steps.filter(s => s.completed).length}/{project.steps.length} steps</span>
                          <span>{project.resources.programs.filter(p => p.installed).length}/{project.resources.programs.length} programs</span>
                          <span>{project.resources.accounts.filter(a => a.created).length}/{project.resources.accounts.length} accounts</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={(e) => handleDelete(project.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

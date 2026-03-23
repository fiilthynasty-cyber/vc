'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Layers, ArrowLeft, Play, CheckCircle2, Circle, Clock, 
  Package, UserCircle, Link2, ArrowRight, Settings, Bot
} from 'lucide-react'
import { getProject, saveProject } from '@/lib/storage'
import { ProjectAssistant } from '@/components/project-assistant'
import type { Project } from '@/lib/types'

export default function ProjectDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)

  useEffect(() => {
    const p = getProject(id)
    if (p) {
      setProject(p)
    }
    setIsLoaded(true)
  }, [id])

  if (!isLoaded) {
    return <LoadingState />
  }

  if (!project) {
    return <NotFoundState />
  }

  const completedSteps = project.steps.filter(s => s.completed).length
  const totalSteps = project.steps.length
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
  const currentStep = project.steps.find(s => !s.completed) || project.steps[project.steps.length - 1]
  const installedPrograms = project.resources.programs.filter(p => p.installed).length
  const createdAccounts = project.resources.accounts.filter(a => a.created).length

  const startProject = () => {
    if (project.status === 'planning') {
      const updated = { ...project, status: 'in-progress' as const }
      saveProject(updated)
      setProject(updated)
    }
    router.push(`/projects/${id}/step/${currentStep?.number || 1}`)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-accent" />
          <span className="font-semibold text-lg">Command Center</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              All Projects
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            onClick={() => setShowAssistant(true)}
          >
            <Bot className="w-4 h-4" />
            AI Help
          </Button>
          <Link href={`/projects/${id}/settings`}>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="capitalize">{project.type}</Badge>
            <Badge 
              variant={project.status === 'completed' ? 'default' : 'secondary'}
              className={project.status === 'completed' ? 'bg-success text-success-foreground' : ''}
            >
              {project.status === 'in-progress' ? 'In Progress' : 
               project.status === 'completed' ? 'Completed' : 'Planning'}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.name}</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">{project.goal}</p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="text-2xl font-bold mb-2">{progress}%</div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Steps</div>
              <div className="text-2xl font-bold">{completedSteps}/{totalSteps}</div>
              <div className="text-xs text-muted-foreground">completed</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Programs</div>
              <div className="text-2xl font-bold">{installedPrograms}/{project.resources.programs.length}</div>
              <div className="text-xs text-muted-foreground">installed</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Accounts</div>
              <div className="text-2xl font-bold">{createdAccounts}/{project.resources.accounts.length}</div>
              <div className="text-xs text-muted-foreground">created</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Step / Action */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {project.status === 'completed' ? 'Project Complete!' : 'Current Step'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.status === 'completed' ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      You&apos;ve completed all steps in this project. Great work!
                    </p>
                  </div>
                ) : currentStep ? (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="font-medium text-accent">Step {currentStep.number}</span>
                      <span>of {totalSteps}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{currentStep.title}</h3>
                    <p className="text-muted-foreground mb-4">{currentStep.description}</p>
                    
                    {currentStep.estimatedTime > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Clock className="w-4 h-4" />
                        <span>Estimated: {currentStep.estimatedTime} minutes</span>
                      </div>
                    )}

                    <Button onClick={startProject} className="gap-2">
                      <Play className="w-4 h-4" />
                      {project.status === 'planning' ? 'Start Project' : 'Continue'}
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Steps Checklist */}
            <Card className="bg-card border-border mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">All Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.steps.map(step => (
                    <Link
                      key={step.id}
                      href={`/projects/${id}/step/${step.number}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        step.completed 
                          ? 'bg-success/10 text-success' 
                          : step.id === currentStep?.id
                          ? 'bg-accent/10 border border-accent/30'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <Circle className={`w-5 h-5 flex-shrink-0 ${step.id === currentStep?.id ? 'text-accent' : 'text-muted-foreground'}`} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${step.completed ? '' : step.id === currentStep?.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.number}. {step.title}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resources Sidebar */}
          <div className="space-y-6">
            {/* Quick Links to Resources */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/projects/${id}/resources`}>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Programs
                    </span>
                    <Badge variant="secondary">{installedPrograms}/{project.resources.programs.length}</Badge>
                  </Button>
                </Link>
                <Link href={`/projects/${id}/resources`}>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <UserCircle className="w-4 h-4" />
                      Accounts
                    </span>
                    <Badge variant="secondary">{createdAccounts}/{project.resources.accounts.length}</Badge>
                  </Button>
                </Link>
                <Link href={`/projects/${id}/resources`}>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Link2 className="w-4 h-4" />
                      Links
                    </span>
                    <Badge variant="secondary">{project.resources.links.length}</Badge>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Needs Attention */}
            {(project.resources.programs.some(p => !p.installed) || 
              project.resources.accounts.some(a => !a.created)) && (
              <Card className="bg-card border-border border-accent/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-accent">Setup Required</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.resources.programs.filter(p => !p.installed).slice(0, 3).map(prog => (
                    <div key={prog.id} className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{prog.name}</span>
                    </div>
                  ))}
                  {project.resources.accounts.filter(a => !a.created).slice(0, 3).map(acc => (
                    <div key={acc.id} className="flex items-center gap-2 text-sm">
                      <UserCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{acc.service}</span>
                    </div>
                  ))}
                  <Link href={`/projects/${id}/resources`}>
                    <Button variant="link" size="sm" className="px-0 text-accent">
                      View all resources
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Floating Panel */}
      <ProjectAssistant 
        project={project} 
        isOpen={showAssistant} 
        onClose={() => setShowAssistant(false)} 
      />
    </main>
  )
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-accent" />
          <span className="font-semibold text-lg">Command Center</span>
        </Link>
      </header>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    </main>
  )
}

function NotFoundState() {
  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-accent" />
          <span className="font-semibold text-lg">Command Center</span>
        </Link>
      </header>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-muted-foreground">Project not found</div>
        <Link href="/projects">
          <Button>View All Projects</Button>
        </Link>
      </div>
    </main>
  )
}

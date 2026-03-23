'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Layers, ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, 
  Package, UserCircle, ChevronLeft, ChevronRight, Check, RotateCcw
} from 'lucide-react'
import { getProject, saveProject } from '@/lib/storage'
import { StepAssistant } from '@/components/step-assistant'
import type { Project, Step } from '@/lib/types'

export default function StepPage({ params }: { params: Promise<{ id: string; num: string }> }) {
  const { id, num } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [notes, setNotes] = useState('')

  const stepNumber = parseInt(num, 10)

  useEffect(() => {
    const p = getProject(id)
    if (p) {
      setProject(p)
      const step = p.steps.find(s => s.number === stepNumber)
      if (step) {
        setNotes(step.notes || '')
      }
    }
    setIsLoaded(true)
  }, [id, stepNumber])

  if (!isLoaded) {
    return <LoadingState />
  }

  if (!project) {
    return <NotFoundState />
  }

  const step = project.steps.find(s => s.number === stepNumber)
  if (!step) {
    return <NotFoundState />
  }

  const totalSteps = project.steps.length
  const hasPrevious = stepNumber > 1
  const hasNext = stepNumber < totalSteps

  const updateNotes = (newNotes: string) => {
    setNotes(newNotes)
    const updatedSteps = project.steps.map(s =>
      s.number === stepNumber ? { ...s, notes: newNotes } : s
    )
    const updated = { ...project, steps: updatedSteps }
    saveProject(updated)
    setProject(updated)
  }

  const toggleComplete = () => {
    const isCompleting = !step.completed
    const updatedSteps = project.steps.map(s =>
      s.number === stepNumber 
        ? { ...s, completed: isCompleting, completedAt: isCompleting ? new Date().toISOString() : undefined } 
        : s
    )
    
    // Check if all steps are now completed
    const allComplete = updatedSteps.every(s => s.completed)
    const status = allComplete ? 'completed' : 'in-progress'
    
    const updated = { ...project, steps: updatedSteps, status: status as Project['status'] }
    saveProject(updated)
    setProject(updated)

    // Auto-advance to next step when completing
    if (isCompleting && hasNext) {
      router.push(`/projects/${id}/step/${stepNumber + 1}`)
    }
  }

  const goToNext = () => {
    if (hasNext) {
      router.push(`/projects/${id}/step/${stepNumber + 1}`)
    }
  }

  const goToPrevious = () => {
    if (hasPrevious) {
      router.push(`/projects/${id}/step/${stepNumber - 1}`)
    }
  }

  // Find required programs and accounts for this step
  const requiredPrograms = project.resources.programs.filter(p => 
    step.requirements.some(r => r.toLowerCase().includes(p.name.toLowerCase()))
  )
  const requiredAccounts = project.resources.accounts.filter(a => 
    step.requirements.some(r => r.toLowerCase().includes(a.service.toLowerCase()))
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-accent" />
          <span className="font-semibold text-lg">Command Center</span>
        </Link>
        <Link href={`/projects/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        {/* Step Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToPrevious}
            disabled={!hasPrevious}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {project.steps.map((s, i) => (
              <Link key={s.id} href={`/projects/${id}/step/${s.number}`}>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    s.completed 
                      ? 'bg-success text-success-foreground'
                      : s.number === stepNumber
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {s.completed ? <Check className="w-4 h-4" /> : s.number}
                </div>
              </Link>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToNext}
            disabled={!hasNext}
            className="gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Step Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline" className="text-accent border-accent">
              Step {stepNumber} of {totalSteps}
            </Badge>
            {step.completed && (
              <Badge className="bg-success text-success-foreground gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </Badge>
            )}
            {step.estimatedTime > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Clock className="w-3 h-3" />
                {step.estimatedTime} min
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">{step.title}</h1>
          <p className="text-muted-foreground text-lg">{step.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructions */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed">{step.instructions}</p>
                </div>
              </CardContent>
            </Card>

            {/* Success Criteria */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">How to Know When Done</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{step.successCriteria}</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <StepAssistant project={project} step={step} />

            {/* Notes */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => updateNotes(e.target.value)}
                  placeholder="Add any notes, observations, or reminders for this step..."
                  className="min-h-[120px] bg-secondary border-border resize-none"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {step.completed ? (
                <Button 
                  variant="outline" 
                  onClick={toggleComplete}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Mark as Incomplete
                </Button>
              ) : (
                <Button 
                  onClick={toggleComplete}
                  className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Complete & Continue
                </Button>
              )}
              
              {hasNext && step.completed && (
                <Button variant="outline" onClick={goToNext} className="gap-2">
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            {step.requirements.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Circle className="w-3 h-3 mt-1.5 text-accent flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Required Programs */}
            {requiredPrograms.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Programs Needed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {requiredPrograms.map(prog => (
                    <div key={prog.id} className="flex items-center justify-between">
                      <span className="text-sm">{prog.name}</span>
                      {prog.installed ? (
                        <Badge variant="secondary" className="text-success">Installed</Badge>
                      ) : (
                        <Badge variant="outline">Not installed</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Required Accounts */}
            {requiredAccounts.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    Accounts Needed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {requiredAccounts.map(acc => (
                    <div key={acc.id} className="flex items-center justify-between">
                      <span className="text-sm">{acc.service}</span>
                      {acc.created ? (
                        <Badge variant="secondary" className="text-success">Created</Badge>
                      ) : (
                        <Badge variant="outline">Not created</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Resources Link */}
            <Link href={`/projects/${id}/resources`}>
              <Button variant="outline" className="w-full gap-2">
                View All Resources
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
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
        <div className="text-muted-foreground">Loading step...</div>
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
        <div className="text-muted-foreground">Step not found</div>
        <Link href="/projects">
          <Button>View All Projects</Button>
        </Link>
      </div>
    </main>
  )
}

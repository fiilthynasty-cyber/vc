'use client'

import { useEffect, useState, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Layers, ArrowLeft, Save, Download, Upload, Trash2, AlertTriangle
} from 'lucide-react'
import { getProject, saveProject, deleteProject as removeProject } from '@/lib/storage'
import type { Project } from '@/lib/types'

export default function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const p = getProject(id)
    if (p) {
      setProject(p)
      setName(p.name)
      setGoal(p.goal)
    }
    setIsLoaded(true)
  }, [id])

  if (!isLoaded) {
    return <LoadingState />
  }

  if (!project) {
    return <NotFoundState />
  }

  const handleSave = () => {
    const updated = { ...project, name, goal }
    saveProject(updated)
    setProject(updated)
    setHasChanges(false)
  }

  const handleNameChange = (value: string) => {
    setName(value)
    setHasChanges(value !== project.name || goal !== project.goal)
  }

  const handleGoalChange = (value: string) => {
    setGoal(value)
    setHasChanges(name !== project.name || value !== project.goal)
  }

  const exportProject = () => {
    const data = JSON.stringify(project, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-project.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as Project
        // Merge imported data but keep the current ID
        const merged: Project = {
          ...imported,
          id: project.id,
          updatedAt: new Date().toISOString(),
        }
        saveProject(merged)
        setProject(merged)
        setName(merged.name)
        setGoal(merged.goal)
        alert('Project data imported successfully!')
      } catch {
        alert('Failed to import project data. Invalid file format.')
      }
    }
    reader.readAsText(file)
  }

  const handleDelete = () => {
    removeProject(id)
    router.push('/projects')
  }

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

      <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Project Settings</h1>

        {/* Edit Project */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Update your project name and goal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Goal</label>
              <Textarea
                value={goal}
                onChange={(e) => handleGoalChange(e.target.value)}
                className="bg-secondary border-border min-h-[100px] resize-none"
              />
            </div>
            <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Export/Import */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle>Backup & Restore</CardTitle>
            <CardDescription>Export your project as JSON or import from a backup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button variant="outline" onClick={exportProject} className="gap-2">
                <Download className="w-4 h-4" />
                Export Project
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Data
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Export creates a JSON backup of all your project data including steps, resources, and progress.
            </p>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-card border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            {showDeleteConfirm ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <Button variant="destructive" onClick={handleDelete} className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete Project
                  </Button>
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </Button>
            )}
          </CardContent>
        </Card>
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
        <div className="text-muted-foreground">Loading settings...</div>
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

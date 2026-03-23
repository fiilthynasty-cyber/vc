'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Layers, ArrowLeft, Package, UserCircle, Link2, 
  ExternalLink, Download, Plus, X, CheckCircle2
} from 'lucide-react'
import { getProject, saveProject, generateId } from '@/lib/storage'
import type { Project, Program, Account, ResourceLink } from '@/lib/types'

export default function ResourcesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState('programs')

  // New item forms
  const [showNewProgram, setShowNewProgram] = useState(false)
  const [showNewAccount, setShowNewAccount] = useState(false)
  const [showNewLink, setShowNewLink] = useState(false)

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

  const toggleProgramInstalled = (progId: string) => {
    const updatedPrograms = project.resources.programs.map(p =>
      p.id === progId ? { ...p, installed: !p.installed } : p
    )
    const updated = { ...project, resources: { ...project.resources, programs: updatedPrograms } }
    saveProject(updated)
    setProject(updated)
  }

  const toggleAccountCreated = (accId: string) => {
    const updatedAccounts = project.resources.accounts.map(a =>
      a.id === accId ? { ...a, created: !a.created } : a
    )
    const updated = { ...project, resources: { ...project.resources, accounts: updatedAccounts } }
    saveProject(updated)
    setProject(updated)
  }

  const addProgram = (prog: Omit<Program, 'id' | 'installed' | 'notes'>) => {
    const newProgram: Program = { ...prog, id: generateId(), installed: false, notes: '' }
    const updated = { 
      ...project, 
      resources: { ...project.resources, programs: [...project.resources.programs, newProgram] } 
    }
    saveProject(updated)
    setProject(updated)
    setShowNewProgram(false)
  }

  const addAccount = (acc: Omit<Account, 'id' | 'created' | 'notes'>) => {
    const newAccount: Account = { ...acc, id: generateId(), created: false, notes: '' }
    const updated = { 
      ...project, 
      resources: { ...project.resources, accounts: [...project.resources.accounts, newAccount] } 
    }
    saveProject(updated)
    setProject(updated)
    setShowNewAccount(false)
  }

  const addLink = (link: Omit<ResourceLink, 'id'>) => {
    const newLink: ResourceLink = { ...link, id: generateId() }
    const updated = { 
      ...project, 
      resources: { ...project.resources, links: [...project.resources.links, newLink] } 
    }
    saveProject(updated)
    setProject(updated)
    setShowNewLink(false)
  }

  const removeProgram = (progId: string) => {
    const updated = { 
      ...project, 
      resources: { ...project.resources, programs: project.resources.programs.filter(p => p.id !== progId) } 
    }
    saveProject(updated)
    setProject(updated)
  }

  const removeAccount = (accId: string) => {
    const updated = { 
      ...project, 
      resources: { ...project.resources, accounts: project.resources.accounts.filter(a => a.id !== accId) } 
    }
    saveProject(updated)
    setProject(updated)
  }

  const removeLink = (linkId: string) => {
    const updated = { 
      ...project, 
      resources: { ...project.resources, links: project.resources.links.filter(l => l.id !== linkId) } 
    }
    saveProject(updated)
    setProject(updated)
  }

  const installedPrograms = project.resources.programs.filter(p => p.installed).length
  const createdAccounts = project.resources.accounts.filter(a => a.created).length

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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Resources</h1>
          <p className="text-muted-foreground">
            All the programs, accounts, and links you need for <span className="text-foreground">{project.name}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{installedPrograms}/{project.resources.programs.length}</div>
              <div className="text-sm text-muted-foreground">Programs Installed</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{createdAccounts}/{project.resources.accounts.length}</div>
              <div className="text-sm text-muted-foreground">Accounts Created</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{project.resources.links.length}</div>
              <div className="text-sm text-muted-foreground">Saved Links</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="programs" className="gap-2">
              <Package className="w-4 h-4" />
              Programs
              <Badge variant="secondary" className="ml-1">{project.resources.programs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="gap-2">
              <UserCircle className="w-4 h-4" />
              Accounts
              <Badge variant="secondary" className="ml-1">{project.resources.accounts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="links" className="gap-2">
              <Link2 className="w-4 h-4" />
              Links
              <Badge variant="secondary" className="ml-1">{project.resources.links.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-4">
            {project.resources.programs.map(prog => (
              <Card key={prog.id} className={`bg-card border-border ${prog.installed ? 'border-success/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={prog.installed}
                      onCheckedChange={() => toggleProgramInstalled(prog.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${prog.installed ? 'text-success' : ''}`}>{prog.name}</h3>
                        {prog.installed && <CheckCircle2 className="w-4 h-4 text-success" />}
                        {prog.requiredVersion && (
                          <Badge variant="outline" className="text-xs">v{prog.requiredVersion}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{prog.description}</p>
                      {prog.downloadUrl && (
                        <a 
                          href={prog.downloadUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                        >
                          <Download className="w-3 h-3" />
                          Download
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeProgram(prog.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {showNewProgram ? (
              <NewProgramForm onAdd={addProgram} onCancel={() => setShowNewProgram(false)} />
            ) : (
              <Button variant="outline" className="w-full gap-2" onClick={() => setShowNewProgram(true)}>
                <Plus className="w-4 h-4" />
                Add Program
              </Button>
            )}
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-4">
            {project.resources.accounts.map(acc => (
              <Card key={acc.id} className={`bg-card border-border ${acc.created ? 'border-success/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={acc.created}
                      onCheckedChange={() => toggleAccountCreated(acc.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${acc.created ? 'text-success' : ''}`}>{acc.service}</h3>
                        {acc.created && <CheckCircle2 className="w-4 h-4 text-success" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{acc.description}</p>
                      {acc.loginUrl && (
                        <a 
                          href={acc.loginUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                        >
                          Sign up / Login
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeAccount(acc.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {showNewAccount ? (
              <NewAccountForm onAdd={addAccount} onCancel={() => setShowNewAccount(false)} />
            ) : (
              <Button variant="outline" className="w-full gap-2" onClick={() => setShowNewAccount(true)}>
                <Plus className="w-4 h-4" />
                Add Account
              </Button>
            )}
          </TabsContent>

          {/* Links Tab */}
          <TabsContent value="links" className="space-y-4">
            {project.resources.links.map(link => (
              <Card key={link.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Link2 className="w-5 h-5 text-accent mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{link.title}</h3>
                        <Badge variant="outline" className="text-xs">{link.category}</Badge>
                      </div>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-accent hover:underline truncate max-w-full"
                      >
                        {link.url}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeLink(link.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {showNewLink ? (
              <NewLinkForm onAdd={addLink} onCancel={() => setShowNewLink(false)} />
            ) : (
              <Button variant="outline" className="w-full gap-2" onClick={() => setShowNewLink(true)}>
                <Plus className="w-4 h-4" />
                Add Link
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function NewProgramForm({ 
  onAdd, 
  onCancel 
}: { 
  onAdd: (prog: Omit<Program, 'id' | 'installed' | 'notes'>) => void
  onCancel: () => void 
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAdd({ name: name.trim(), description: description.trim(), downloadUrl: downloadUrl.trim() })
    }
  }

  return (
    <Card className="bg-card border-accent">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Program name"
            className="bg-secondary border-border"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="bg-secondary border-border"
          />
          <Input
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            placeholder="Download URL"
            className="bg-secondary border-border"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={!name.trim()}>Add Program</Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function NewAccountForm({ 
  onAdd, 
  onCancel 
}: { 
  onAdd: (acc: Omit<Account, 'id' | 'created' | 'notes'>) => void
  onCancel: () => void 
}) {
  const [service, setService] = useState('')
  const [description, setDescription] = useState('')
  const [loginUrl, setLoginUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (service.trim()) {
      onAdd({ service: service.trim(), description: description.trim(), loginUrl: loginUrl.trim() || undefined })
    }
  }

  return (
    <Card className="bg-card border-accent">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Service name"
            className="bg-secondary border-border"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="bg-secondary border-border"
          />
          <Input
            value={loginUrl}
            onChange={(e) => setLoginUrl(e.target.value)}
            placeholder="Login/Signup URL"
            className="bg-secondary border-border"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={!service.trim()}>Add Account</Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function NewLinkForm({ 
  onAdd, 
  onCancel 
}: { 
  onAdd: (link: Omit<ResourceLink, 'id'>) => void
  onCancel: () => void 
}) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && url.trim()) {
      onAdd({ title: title.trim(), url: url.trim(), category: category.trim() || 'General' })
    }
  }

  return (
    <Card className="bg-card border-accent">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Link title"
            className="bg-secondary border-border"
          />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
            className="bg-secondary border-border"
          />
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g., Documentation)"
            className="bg-secondary border-border"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={!title.trim() || !url.trim()}>Add Link</Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
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
        <div className="text-muted-foreground">Loading resources...</div>
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

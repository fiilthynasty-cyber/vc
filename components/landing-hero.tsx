'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Layers, ListChecks, FolderOpen, Sparkles } from 'lucide-react'

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Accent glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <div className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-accent" />
          <span className="font-semibold text-lg">Command Center</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
        </nav>
        <Link href="/new-project">
          <Button variant="outline" size="sm">Get Started</Button>
        </Link>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-tight text-balance">
          Ship projects<br />
          <span className="text-accent">that work.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
          AI-powered project planning and execution. Get a complete roadmap, 
          track every step, and organize all your tools in one place.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/new-project">
            <Button size="lg" className="gap-2 px-8">
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" size="lg" className="px-8">
              View Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Preview */}
      <div id="features" className="relative z-10 px-6 pb-20 md:px-12 lg:px-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Sparkles className="w-5 h-5" />}
            title="AI Plan Generation"
            description="Describe your goal and get a complete step-by-step plan with all required tools and accounts."
          />
          <FeatureCard
            icon={<ListChecks className="w-5 h-5" />}
            title="Progress Tracking"
            description="Track every step, add notes, and pick up exactly where you left off."
          />
          <FeatureCard
            icon={<FolderOpen className="w-5 h-5" />}
            title="Resource Organization"
            description="Keep all your programs, accounts, and links organized by project."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}

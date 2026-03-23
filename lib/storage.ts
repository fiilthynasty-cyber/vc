import type { Project } from './types'

const STORAGE_KEY = 'project-command-center'

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getProject(id: string): Project | undefined {
  const projects = getProjects()
  return projects.find(p => p.id === id)
}

export function saveProject(project: Project): void {
  const projects = getProjects()
  const existingIndex = projects.findIndex(p => p.id === project.id)
  
  if (existingIndex >= 0) {
    projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() }
  } else {
    projects.push(project)
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function exportProjects(): string {
  return JSON.stringify(getProjects(), null, 2)
}

export function importProjects(json: string): boolean {
  try {
    const projects = JSON.parse(json)
    if (Array.isArray(projects)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
      return true
    }
    return false
  } catch {
    return false
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

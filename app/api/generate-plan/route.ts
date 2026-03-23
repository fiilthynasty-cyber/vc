import { generateText, Output } from 'ai'
import { z } from 'zod'

const stepSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  description: z.string(),
  instructions: z.string(),
  requirements: z.array(z.string()),
  successCriteria: z.string(),
  estimatedTime: z.number(),
})

const programSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  downloadUrl: z.string(),
  requiredVersion: z.string().nullable(),
})

const accountSchema = z.object({
  id: z.string(),
  service: z.string(),
  description: z.string(),
  loginUrl: z.string().nullable(),
})

const linkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  category: z.string(),
})

const planSchema = z.object({
  steps: z.array(stepSchema),
  resources: z.object({
    programs: z.array(programSchema),
    accounts: z.array(accountSchema),
    links: z.array(linkSchema),
  }),
})

export async function POST(req: Request) {
  const { name, type, goal } = await req.json()

  const systemPrompt = `You are an expert project planner. Generate a comprehensive, actionable plan for the user's project.

Project Type: ${type}
Project Name: ${name}

Your task:
1. Break down the project into clear, sequential steps (5-15 steps depending on complexity)
2. List all programs/tools the user will need to install
3. List all accounts/services the user will need to create
4. Provide helpful resource links for documentation and tutorials

For each step:
- Give a clear title and detailed description
- Provide specific, actionable instructions
- List any programs or accounts required for that step
- Define clear success criteria (how to know when it's done)
- Estimate time in minutes (be realistic)

For programs:
- Include the official download URL
- Note any specific version requirements

For accounts:
- Include the signup/login URL
- Explain what the account is needed for

Generate unique IDs for each item (use format like "step-1", "prog-1", "acc-1", "link-1").`

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4.6',
    output: Output.object({
      schema: planSchema,
    }),
    system: systemPrompt,
    prompt: `Create a detailed project plan for: ${goal}`,
  })

  // Add default properties to steps
  const steps = output?.steps.map(step => ({
    ...step,
    notes: '',
    completed: false,
    completedAt: undefined,
  })) || []

  // Add default properties to resources
  const resources = {
    programs: output?.resources.programs.map(prog => ({
      ...prog,
      requiredVersion: prog.requiredVersion || undefined,
      installed: false,
      notes: '',
    })) || [],
    accounts: output?.resources.accounts.map(acc => ({
      ...acc,
      loginUrl: acc.loginUrl || undefined,
      created: false,
      notes: '',
    })) || [],
    links: output?.resources.links || [],
  }

  return Response.json({ steps, resources })
}

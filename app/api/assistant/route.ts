import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'

export const maxDuration = 60

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context: StepContext } = await req.json()

  const systemPrompt = buildSystemPrompt(context)

  const result = streamText({
    model: 'openai/gpt-4o',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}

interface StepContext {
  projectName: string
  projectType: string
  projectGoal: string
  currentStep: {
    number: number
    title: string
    description: string
    instructions: string
    successCriteria: string
    requirements: string[]
  }
  totalSteps: number
  completedSteps: number
  programs: { name: string; installed: boolean; purpose: string }[]
  accounts: { service: string; created: boolean; purpose: string }[]
}

function buildSystemPrompt(context: StepContext): string {
  const { projectName, projectType, projectGoal, currentStep, totalSteps, completedSteps, programs, accounts } = context

  const programsList = programs.map(p => 
    `- ${p.name}: ${p.purpose} [${p.installed ? 'INSTALLED' : 'NOT INSTALLED'}]`
  ).join('\n')

  const accountsList = accounts.map(a => 
    `- ${a.service}: ${a.purpose} [${a.created ? 'CREATED' : 'NOT CREATED'}]`
  ).join('\n')

  return `You are a helpful project assistant guiding the user through their project step by step. You do ALL the heavy lifting - explain everything clearly, provide exact commands, give detailed instructions, and anticipate problems.

## Current Project
- **Name:** ${projectName}
- **Type:** ${projectType}
- **Goal:** ${projectGoal}
- **Progress:** ${completedSteps}/${totalSteps} steps completed

## Current Step (${currentStep.number} of ${totalSteps})
**${currentStep.title}**

Description: ${currentStep.description}

Instructions: ${currentStep.instructions}

Success Criteria: ${currentStep.successCriteria}

Requirements: ${currentStep.requirements.join(', ') || 'None specified'}

## Programs for this project:
${programsList || 'None specified'}

## Accounts for this project:
${accountsList || 'None specified'}

## Your Role
1. **Be extremely detailed** - Give exact commands, URLs, button names, menu paths
2. **Anticipate problems** - Warn about common errors and how to fix them
3. **Explain WHY** - Help the user understand what they're doing, not just how
4. **Be proactive** - If something seems unclear, clarify it before the user asks
5. **Stay focused** - Keep answers relevant to the current step
6. **Use formatting** - Use bullet points, numbered lists, and code blocks for clarity

When the user asks a question:
- If it's about the current step, provide detailed, actionable guidance
- If they're stuck, walk them through it step by step
- If they need to install something, give exact download links and installation steps
- If they need to create an account, explain what info they'll need and any gotchas
- If they ask something unrelated, briefly answer but redirect to the current step

Always be encouraging but direct. The user wants to get things done, not read long explanations.`
}

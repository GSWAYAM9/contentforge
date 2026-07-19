import { BaseAgent } from './base-agent'
import { AgentExecutionContext } from '../types/ai'
import { getPrompt } from '../prompts'

export class AccessibilityAgent extends BaseAgent {
  constructor() {
    super('Accessibility Specialist')
  }

  buildPrompt(context: AgentExecutionContext): string {
    const basePrompt = getPrompt('accessibility')
    const article = context.previousOutputs?.get('Content Writer') || context.prompt

    return `${basePrompt}

Article to check:
${article}

Topic: ${context.prompt}
Language: ${context.language}

Memory - Accessibility Standards: ${context.memory.accessibilityStandards || 'WCAG 2.1 AA'}

${this.formatContext(context)}

Check the article against accessibility standards (WCAG 2.1 AA). Include alt text suggestions, heading hierarchy validation, contrast analysis, and readability metrics.`
  }
}

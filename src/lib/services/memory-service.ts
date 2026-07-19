import { ProjectMemory, AgentExecutionContext } from '../types/ai'

/**
 * ProjectMemoryService manages persistent learning and preferences for each project
 * Learns from successful content patterns and stores project-specific insights
 */
export class ProjectMemoryService {
  private projectId: string
  private memory: ProjectMemory
  private dirty: boolean = false

  constructor(projectId: string, initialMemory?: ProjectMemory) {
    this.projectId = projectId
    this.memory = initialMemory || this.createDefaultMemory()
  }

  private createDefaultMemory(): ProjectMemory {
    return {
      projectId: this.projectId,
      brandVoice: '',
      writingStyle: 'professional',
      grammarPreferences: 'standard',
      preferredCTA: '',
      frequentKeywords: [],
      successfulArticles: [],
      successfulPatterns: [],
      failedPatterns: [],
      internalUrls: [],
      customInstructions: '',
      availableUrls: [],
      accessibilityStandards: 'WCAG 2.1 AA',
      previousTopics: [],
      performanceMetrics: {
        averageTokensPerArticle: 0,
        averageCostPerArticle: 0,
        successRate: 100,
        averageRating: 0,
      },
      preferences: {
        contentLength: 'medium',
        tone: 'professional',
        includeImages: true,
        includeLinks: true,
        includeTableOfContents: false,
        includeFAQ: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  /**
   * Update project brand voice
   */
  setBrandVoice(brandVoice: string): void {
    this.memory.brandVoice = brandVoice
    this.dirty = true
  }

  /**
   * Update writing style preferences
   */
  setWritingStyle(style: string): void {
    this.memory.writingStyle = style
    this.dirty = true
  }

  /**
   * Add successful article to memory
   */
  recordSuccessfulArticle(articleData: {
    topic: string
    keywords: string[]
    wordCount: number
    tokensUsed: number
    cost: number
    rating?: number
  }): void {
    this.memory.successfulArticles.push({
      ...articleData,
      recordedAt: new Date(),
    })

    // Extract patterns from successful article
    this.extractPatterns(articleData)

    // Update performance metrics
    this.updateMetrics(articleData)

    this.dirty = true
  }

  /**
   * Add pattern observed from successful content
   */
  addSuccessfulPattern(pattern: string): void {
    if (!this.memory.successfulPatterns.includes(pattern)) {
      this.memory.successfulPatterns.push(pattern)
      this.dirty = true
    }
  }

  /**
   * Record failed pattern to avoid in future
   */
  addFailedPattern(pattern: string): void {
    if (!this.memory.failedPatterns.includes(pattern)) {
      this.memory.failedPatterns.push(pattern)
      this.dirty = true
    }
  }

  /**
   * Add internal URLs available for linking
   */
  addInternalUrls(urls: string[]): void {
    const newUrls = urls.filter(url => !this.memory.internalUrls.includes(url))
    if (newUrls.length > 0) {
      this.memory.internalUrls.push(...newUrls)
      this.memory.availableUrls = this.memory.internalUrls
      this.dirty = true
    }
  }

  /**
   * Update frequently used keywords
   */
  updateFrequentKeywords(keywords: string[]): void {
    const keywordMap = new Map<string, number>()

    // Existing keywords
    this.memory.frequentKeywords.forEach(kw => {
      keywordMap.set(kw, (keywordMap.get(kw) || 0) + 1)
    })

    // New keywords
    keywords.forEach(kw => {
      keywordMap.set(kw, (keywordMap.get(kw) || 0) + 1)
    })

    // Sort by frequency and keep top 50
    this.memory.frequentKeywords = Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([kw]) => kw)

    this.dirty = true
  }

  /**
   * Set custom instructions for this project
   */
  setCustomInstructions(instructions: string): void {
    this.memory.customInstructions = instructions
    this.dirty = true
  }

  /**
   * Update content preferences
   */
  updatePreferences(preferences: Partial<ProjectMemory['preferences']>): void {
    this.memory.preferences = {
      ...this.memory.preferences,
      ...preferences,
    }
    this.dirty = true
  }

  /**
   * Get full memory for use in agents
   */
  getMemory(): ProjectMemory {
    return { ...this.memory }
  }

  /**
   * Export memory for database storage
   */
  async save(): Promise<void> {
    if (!this.dirty) return

    try {
      // TODO: Implement database save
      // const { db } = await import('@/lib/db')
      // const { projectMemory } = await import('@/lib/db/schema')
      // await db.insert(projectMemory).values(this.memory).onConflictDoUpdate({...})
      console.log('[v0] Project memory saved for project:', this.projectId)
      this.memory.updatedAt = new Date()
      this.dirty = false
    } catch (error) {
      console.error('[v0] Error saving project memory:', error)
      throw error
    }
  }

  /**
   * Load memory from database
   */
  static async load(projectId: string): Promise<ProjectMemoryService> {
    try {
      // TODO: Implement database load
      // const { db } = await import('@/lib/db')
      // const { projectMemory } = await import('@/lib/db/schema')
      // const existing = await db.query.projectMemory.findFirst({...})
      // return new ProjectMemoryService(projectId, existing)
      return new ProjectMemoryService(projectId)
    } catch (error) {
      console.error('[v0] Error loading project memory:', error)
      return new ProjectMemoryService(projectId)
    }
  }

  /**
   * Private: Extract patterns from successful content
   */
  private extractPatterns(articleData: {
    topic: string
    keywords: string[]
    wordCount: number
  }): void {
    // Extract structure patterns
    if (articleData.wordCount > 2000) {
      this.addSuccessfulPattern('long-form-content')
    }
    if (articleData.keywords.length > 5) {
      this.addSuccessfulPattern('multi-keyword-targeting')
    }

    // Update topic history
    if (!this.memory.previousTopics.includes(articleData.topic)) {
      this.memory.previousTopics.push(articleData.topic)
    }
  }

  /**
   * Private: Update performance metrics based on article
   */
  private updateMetrics(articleData: {
    wordCount: number
    tokensUsed: number
    cost: number
    rating?: number
  }): void {
    const metrics = this.memory.performanceMetrics
    const totalArticles = this.memory.successfulArticles.length

    // Update average tokens
    metrics.averageTokensPerArticle =
      (metrics.averageTokensPerArticle * (totalArticles - 1) + articleData.tokensUsed) /
      totalArticles

    // Update average cost
    metrics.averageCostPerArticle =
      (metrics.averageCostPerArticle * (totalArticles - 1) + articleData.cost) / totalArticles

    // Update rating
    if (articleData.rating !== undefined) {
      metrics.averageRating =
        (metrics.averageRating * (totalArticles - 1) + articleData.rating) / totalArticles
    }
  }
}

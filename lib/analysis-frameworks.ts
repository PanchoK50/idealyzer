export interface AnalysisResult {
  summary: string
  pros: string[]
  cons: string[]
  evaluation: string
  frameworks: {
    swot: SWOTAnalysis
    bcg: BCGAnalysis
    businessModel: BusinessModelCanvas
    metrics: AnalysisMetrics
  }
  industryNews: IndustryNewsData
  qualityScore: number
  recommendations: {
    startupNames: string[]
    brandWheel: BrandWheel
    elevatorPitch: string
    actionPlan: string[]
    improvements: string[]
  }
}

export interface SWOTAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface BCGAnalysis {
  category: "star" | "cash-cow" | "question-mark" | "dog"
  marketGrowth: number
  marketShare: number
  reasoning: string
}

export interface BusinessModelCanvas {
  keyPartners: string[]
  keyActivities: string[]
  keyResources: string[]
  valuePropositions: string[]
  customerRelationships: string[]
  channels: string[]
  customerSegments: string[]
  costStructure: string[]
  revenueStreams: string[]
}

export interface AnalysisMetrics {
  desirability: number
  viability: number
  feasibility: number
  sustainability: number
}

export interface BudgetEstimate {
  total: number
  breakdown: {
    development: number
    marketing: number
    operations: number
    legal: number
  }
  timeline: string
}

export interface BrandWheel {
  mission: string
  vision: string
  values: string[]
  personality: string[]
}

export interface NewsArticle {
  title: string
  url: string
  snippet: string
  source: string
  date: string
  relevanceScore: number
}

export interface IndustryNewsData {
  articles: NewsArticle[]
  industryKeywords: string[]
  marketTrends: string[]
  competitiveLandscape: string
}

export const ANALYSIS_PROMPTS = {
  swot: `Analyze this startup idea using the SWOT framework. Identify:
- Strengths: Internal positive factors
- Weaknesses: Internal negative factors  
- Opportunities: External positive factors
- Threats: External negative factors

Provide 3-5 specific points for each category.`,

  bcg: `Analyze this startup idea using the BCG Matrix. Determine:
- Market growth rate (high/low)
- Relative market share (high/low)
- Category classification (Star, Cash Cow, Question Mark, or Dog)
- Reasoning for the classification

Provide numerical estimates where possible.`,

  businessModel: `Create a Business Model Canvas for this startup idea. Define:
- Key Partners: Who are the key partners and suppliers?
- Key Activities: What key activities does the value proposition require?
- Key Resources: What key resources does the value proposition require?
- Value Propositions: What value do we deliver to the customer?
- Customer Relationships: What type of relationship does each customer segment expect?
- Channels: Through which channels do our customer segments want to be reached?
- Customer Segments: For whom are we creating value?
- Cost Structure: What are the most important costs inherent in our business model?
- Revenue Streams: For what value are our customers really willing to pay?`,

  metrics: `Evaluate this startup idea across four key metrics (scale 1-10):
- Desirability: Does this create real value for customers/users?
- Viability: Does this have potential to be financially sustainable?
- Feasibility: Is this technically and operationally feasible?
- Sustainability: Does this create positive long-term impact?

Provide scores and detailed reasoning for each metric.`,

  recommendations: `Based on this startup idea analysis, provide:
- 5 potential startup names
- Brand wheel (mission, vision, 3-5 brand values, 3-5 personality traits)
- Elevator pitch (30-second version)
- 5-step action plan for next 100 days
- 3-5 key improvements or alternatives to consider`,
}

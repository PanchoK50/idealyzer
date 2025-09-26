import { type NextRequest, NextResponse } from "next/server"
import { generateObject, generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import { ANALYSIS_PROMPTS, type AnalysisResult } from "@/lib/analysis-frameworks"

// Schema definitions for structured output
const SWOTSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
})

const BCGSchema = z.object({
  category: z.enum(["star", "cash-cow", "question-mark", "dog"]),
  marketGrowth: z.number(),
  marketShare: z.number(),
  reasoning: z.string(),
})

const BusinessModelSchema = z.object({
  keyPartners: z.array(z.string()),
  keyActivities: z.array(z.string()),
  keyResources: z.array(z.string()),
  valuePropositions: z.array(z.string()),
  customerRelationships: z.array(z.string()),
  channels: z.array(z.string()),
  customerSegments: z.array(z.string()),
  costStructure: z.array(z.string()),
  revenueStreams: z.array(z.string()),
})

const MetricsSchema = z.object({
  desirability: z.number().min(1).max(10),
  viability: z.number().min(1).max(10),
  feasibility: z.number().min(1).max(10),
  sustainability: z.number().min(1).max(10),
})

const RecommendationsSchema = z.object({
  startupNames: z.array(z.string()),
  brandWheel: z.object({
    mission: z.string(),
    vision: z.string(),
    values: z.array(z.string()),
    personality: z.array(z.string()),
  }),
  elevatorPitch: z.string(),
  actionPlan: z.array(z.string()),
  improvements: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    const formData = await request.formData()

    // Extract form fields
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const keyFeatures = JSON.parse((formData.get("keyFeatures") as string) || "[]")
    const valueProposition = formData.get("valueProposition") as string
    const concept = formData.get("concept") as string
    const background = JSON.parse((formData.get("background") as string) || "{}")
    const source = formData.get("source") as string
    const researchData = JSON.parse((formData.get("researchData") as string) || "[]")

    // Process uploaded files (simplified for demo)
    const files = formData.getAll("files") as File[]
    let fileContent = ""

    for (const file of files) {
      if (file.type === "text/plain") {
        fileContent += (await file.text()) + "\n"
      }
      // TODO: Add PDF parsing and image analysis
    }

    // Format research data for context
    const researchContext = researchData.length > 0
      ? `\n\nRELEVANT RESEARCH PAPERS:\n${researchData.map((research: any) =>
          `- ${research.title} (${research.year}) by ${research.authors}\n  Description: ${research.description}\n  Subjects: ${research.subjects.join(', ')}`
        ).join('\n')}`
      : ''

    // Construct comprehensive idea context
    const ideaContext = `
STARTUP IDEA ANALYSIS REQUEST

Title: ${title}
Description: ${description}
Key Features: ${keyFeatures.join(", ")}
Value Proposition: ${valueProposition}
Implementation Concept: ${concept}
Background: ${JSON.stringify(background)}
Source: ${source}
Additional File Content: ${fileContent}${researchContext}
    `.trim()

    // Generate basic summary and evaluation
    const summaryPrompt = researchData.length > 0
      ? `Provide a brief 2-3 sentence summary of this startup idea, incorporating insights from the relevant research papers provided: ${ideaContext}`
      : `Provide a brief 2-3 sentence summary of this startup idea: ${ideaContext}`

    const { text: summary } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: summaryPrompt,
    })

    const evaluationPrompt = researchData.length > 0
      ? `Provide a comprehensive evaluation of this startup idea, including market potential, competitive advantages, and key challenges. Pay special attention to how the provided research papers support or challenge the idea's viability: ${ideaContext}`
      : `Provide a comprehensive evaluation of this startup idea, including market potential, competitive advantages, and key challenges: ${ideaContext}`

    const { text: evaluation } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: evaluationPrompt,
    })

    // Generate pros and cons
    const prosConsPrompt = researchData.length > 0
      ? `Analyze this startup idea and provide 4-6 key pros and 4-6 key cons. Consider how the research papers provided support or challenge different aspects: ${ideaContext}`
      : `Analyze this startup idea and provide 4-6 key pros and 4-6 key cons: ${ideaContext}`

    const { object: prosConsResult } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      schema: z.object({
        pros: z.array(z.string()),
        cons: z.array(z.string()),
      }),
      prompt: prosConsPrompt,
    })

    // Generate SWOT Analysis
    const swotPrompt = researchData.length > 0
      ? `${ANALYSIS_PROMPTS.swot}\n\nWhen analyzing, pay special attention to how the provided research papers inform each aspect of the SWOT analysis.\n\nIdea: ${ideaContext}`
      : `${ANALYSIS_PROMPTS.swot}\n\nIdea: ${ideaContext}`

    const { object: swotAnalysis } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      schema: SWOTSchema,
      prompt: swotPrompt,
    })

    // Generate BCG Matrix Analysis
    const { object: bcgAnalysis } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      schema: BCGSchema,
      prompt: `${ANALYSIS_PROMPTS.bcg}\n\nIdea: ${ideaContext}`,
    })

    // Generate Business Model Canvas
    const { object: businessModel } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      schema: BusinessModelSchema,
      prompt: `${ANALYSIS_PROMPTS.businessModel}\n\nIdea: ${ideaContext}`,
    })

    // Generate Metrics Analysis
    const { object: metrics } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      schema: MetricsSchema,
      prompt: `${ANALYSIS_PROMPTS.metrics}\n\nIdea: ${ideaContext}`,
    })

    // Generate Recommendations
    const { object: recommendations } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      schema: RecommendationsSchema,
      prompt: `${ANALYSIS_PROMPTS.recommendations}\n\nIdea: ${ideaContext}`,
    })

    // Calculate quality score (weighted average of metrics)
    const qualityScore =
      Math.round(
        (metrics.desirability * 0.3 +
          metrics.viability * 0.3 +
          metrics.feasibility * 0.25 +
          metrics.sustainability * 0.15) *
          10,
      ) / 10

    // Fetch industry news data
    let industryNews
    try {
      const newsResponse = await fetch(`${request.url.replace('/api/analyze', '/api/industry-news')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: ideaContext,
          title: title,
          description: description,
          keyFeatures: keyFeatures,
        }),
      })

      if (newsResponse.ok) {
        industryNews = await newsResponse.json()
      } else {
        // Fallback if news API fails
        industryNews = {
          articles: [],
          industryKeywords: [],
          marketTrends: [],
          competitiveLandscape: "Industry news temporarily unavailable.",
        }
      }
    } catch (error) {
      console.error("Failed to fetch industry news:", error)
      industryNews = {
        articles: [],
        industryKeywords: [],
        marketTrends: [],
        competitiveLandscape: "Industry news temporarily unavailable.",
      }
    }

    const result: AnalysisResult = {
      summary,
      pros: prosConsResult.pros,
      cons: prosConsResult.cons,
      evaluation,
      frameworks: {
        swot: swotAnalysis,
        bcg: bcgAnalysis,
        businessModel: businessModel,
        metrics: metrics,
      },
      industryNews,
      qualityScore,
      recommendations,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

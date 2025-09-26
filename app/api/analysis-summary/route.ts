import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import type { AnalysisResult } from "@/lib/analysis-frameworks"

export interface SummaryRequest {
  analysisResult: AnalysisResult
  ideaTitle: string
  summaryType?: 'executive' | 'detailed' | 'quick'
}

export interface SummaryResponse {
  audioScript: string
  estimatedDuration: number // in seconds
  keyPoints: string[]
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 }
      )
    }

    const { analysisResult, ideaTitle, summaryType = 'executive' } = await request.json() as SummaryRequest

    if (!analysisResult || !ideaTitle) {
      return NextResponse.json(
        { error: "Analysis result and idea title are required" },
        { status: 400 }
      )
    }

    // Generate audio script based on summary type
    const audioScript = await generateAudioScript(analysisResult, ideaTitle, summaryType)

    // Estimate duration (roughly 150 words per minute for natural speech)
    const wordCount = audioScript.split(' ').length
    const estimatedDuration = Math.ceil((wordCount / 150) * 60) // in seconds

    // Extract key points for UI display
    const keyPoints = extractKeyPoints(analysisResult, summaryType)

    const response: SummaryResponse = {
      audioScript,
      estimatedDuration,
      keyPoints
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Analysis summary generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate analysis summary" },
      { status: 500 }
    )
  }
}

async function generateAudioScript(
  result: AnalysisResult,
  ideaTitle: string,
  summaryType: 'executive' | 'detailed' | 'quick'
): Promise<string> {
  let prompt = ""

  switch (summaryType) {
    case 'quick':
      prompt = `Create a concise 60-90 second audio summary for the startup idea analysis of "${ideaTitle}".

Analysis Data:
- Quality Score: ${result.qualityScore}/10
- Summary: ${result.summary}
- Top Strengths: ${result.pros.slice(0, 2).join(', ')}
- Key Challenges: ${result.cons.slice(0, 2).join(', ')}
- BCG Category: ${result.frameworks.bcg.category}
- Industry Keywords: ${result.industryNews.industryKeywords.slice(0, 3).join(', ')}

Create a natural, conversational audio script that sounds engaging when read aloud. Use a professional but friendly tone. Include brief pauses marked with [PAUSE]. Start with a greeting and the idea name.`
      break

    case 'detailed':
      prompt = `Create a comprehensive 4-6 minute audio summary for the startup idea analysis of "${ideaTitle}".

Complete Analysis Data:
- Quality Score: ${result.qualityScore}/10
- Summary: ${result.summary}
- Evaluation: ${result.evaluation}

SWOT Analysis:
- Strengths: ${result.frameworks.swot.strengths.join(', ')}
- Weaknesses: ${result.frameworks.swot.weaknesses.join(', ')}
- Opportunities: ${result.frameworks.swot.opportunities.join(', ')}
- Threats: ${result.frameworks.swot.threats.join(', ')}

Metrics:
- Desirability: ${result.frameworks.metrics.desirability}/10
- Viability: ${result.frameworks.metrics.viability}/10
- Feasibility: ${result.frameworks.metrics.feasibility}/10
- Sustainability: ${result.frameworks.metrics.sustainability}/10

BCG Matrix: ${result.frameworks.bcg.category} (${result.frameworks.bcg.reasoning})

Industry News: ${result.industryNews.competitiveLandscape}
Market Trends: ${result.industryNews.marketTrends.slice(0, 3).join('; ')}

Recommendations: ${result.recommendations.improvements.slice(0, 3).join('; ')}

Create a well-structured, natural audio script with clear sections. Use professional language but keep it engaging. Include [PAUSE] markers for natural breaks.`
      break

    default: // executive
      prompt = `Create an executive summary audio script (2-3 minutes) for the startup idea analysis of "${ideaTitle}".

Key Analysis Points:
- Overall Quality Score: ${result.qualityScore}/10
- Summary: ${result.summary}
- Top 3 Strengths: ${result.pros.slice(0, 3).join('; ')}
- Top 3 Challenges: ${result.cons.slice(0, 3).join('; ')}
- BCG Category: ${result.frameworks.bcg.category} - ${result.frameworks.bcg.reasoning}
- Key Metrics: Desirability ${result.frameworks.metrics.desirability}/10, Viability ${result.frameworks.metrics.viability}/10
- Market Position: ${result.industryNews.competitiveLandscape}
- Top Recommendations: ${result.recommendations.improvements.slice(0, 2).join('; ')}
- Elevator Pitch: ${result.recommendations.elevatorPitch}

Create a professional executive briefing that sounds natural when spoken. Use clear, confident language appropriate for stakeholders. Include [PAUSE] markers for emphasis.`
  }

  const { text: audioScript } = await generateText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    prompt: prompt,
  })

  return audioScript
}

function extractKeyPoints(result: AnalysisResult, summaryType: string): string[] {
  const keyPoints: string[] = [
    `Overall Quality Score: ${result.qualityScore}/10`,
    `BCG Classification: ${result.frameworks.bcg.category.replace('-', ' ').toUpperCase()}`,
  ]

  if (summaryType === 'detailed') {
    keyPoints.push(
      `Desirability: ${result.frameworks.metrics.desirability}/10`,
      `Viability: ${result.frameworks.metrics.viability}/10`,
      `Feasibility: ${result.frameworks.metrics.feasibility}/10`,
      ...result.pros.slice(0, 2).map(pro => `✓ ${pro}`),
      ...result.cons.slice(0, 2).map(con => `⚠ ${con}`)
    )
  } else {
    keyPoints.push(
      `Top Strength: ${result.pros[0] || 'Not specified'}`,
      `Key Challenge: ${result.cons[0] || 'Not specified'}`,
      `Market Keywords: ${result.industryNews.industryKeywords.slice(0, 3).join(', ')}`
    )
  }

  return keyPoints
}

export async function GET() {
  return NextResponse.json(
    { error: "GET method not allowed. Use POST with analysis data." },
    { status: 405 }
  )
}
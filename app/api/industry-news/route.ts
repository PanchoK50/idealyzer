import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export interface NewsArticle {
  title: string
  url: string
  snippet: string
  source: string
  date: string
  relevanceScore: number
}

export interface IndustryNewsResponse {
  articles: NewsArticle[]
  industryKeywords: string[]
  marketTrends: string[]
  competitiveLandscape: string
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    const { idea, title, description, keyFeatures, industry } = await request.json()

    // Extract industry keywords from the idea
    const keywordsPrompt = `Extract 5-8 key industry keywords and search terms from this startup idea that would be useful for finding relevant news and market information:

Title: ${title}
Description: ${description}
Key Features: ${keyFeatures?.join(", ") || ""}
Industry Context: ${industry || ""}
Full Idea: ${idea}

Return only comma-separated keywords, no explanations.`

    const { text: keywordsText } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: keywordsPrompt,
    })

    const keywords = keywordsText.split(",").map(k => k.trim()).slice(0, 8)

    // Mock news articles (in a real implementation, you'd use a news API like NewsAPI, Google News API, or web scraping)
    const mockArticles: NewsArticle[] = [
      {
        title: `${keywords[0]} Market Sees 40% Growth in Q4 2024`,
        url: "https://example.com/news1",
        snippet: `Industry analysts report significant growth in the ${keywords[0]} sector, with new innovations driving adoption across multiple verticals.`,
        source: "Industry Today",
        date: "2024-12-15",
        relevanceScore: 0.9
      },
      {
        title: `Top 10 ${keywords[1]} Startups to Watch in 2025`,
        url: "https://example.com/news2",
        snippet: `Leading venture capitalists highlight emerging companies in the ${keywords[1]} space that are poised for breakthrough success.`,
        source: "TechCrunch",
        date: "2024-12-10",
        relevanceScore: 0.85
      },
      {
        title: `${keywords[0]} vs Traditional Solutions: Market Analysis`,
        url: "https://example.com/news3",
        snippet: `Comparative study shows ${keywords[0]} solutions outperforming traditional methods in cost-effectiveness and user satisfaction.`,
        source: "Market Research Weekly",
        date: "2024-12-08",
        relevanceScore: 0.8
      },
      {
        title: `Investment Trends in ${keywords[2]} Technology`,
        url: "https://example.com/news4",
        snippet: `Venture capital firms are increasing investments in ${keywords[2]} startups, with total funding reaching $2.3B this quarter.`,
        source: "VentureBeat",
        date: "2024-12-05",
        relevanceScore: 0.75
      },
      {
        title: `Regulatory Changes Impact ${keywords[1]} Industry`,
        url: "https://example.com/news5",
        snippet: `New regulations announced this week will affect how companies operate in the ${keywords[1]} sector, creating both challenges and opportunities.`,
        source: "Regulatory News",
        date: "2024-12-03",
        relevanceScore: 0.7
      }
    ]

    // Generate market trends analysis
    const trendsPrompt = `Based on these industry keywords: ${keywords.join(", ")}, identify 5-7 current market trends that would be relevant to a startup in this space. Focus on technology trends, user behavior changes, market dynamics, and emerging opportunities.`

    const { text: trendsText } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: trendsPrompt,
    })

    const marketTrends = trendsText.split('\n').filter(line => line.trim().length > 0).slice(0, 7)

    // Generate competitive landscape analysis
    const competitivePrompt = `Provide a brief competitive landscape analysis for a startup with these characteristics:

Title: ${title}
Description: ${description}
Industry Keywords: ${keywords.join(", ")}

Include information about market leaders, emerging players, and competitive dynamics. Keep it concise (2-3 sentences).`

    const { text: competitiveLandscape } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: competitivePrompt,
    })

    const response: IndustryNewsResponse = {
      articles: mockArticles,
      industryKeywords: keywords,
      marketTrends: marketTrends,
      competitiveLandscape: competitiveLandscape.trim(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Industry news fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch industry news" }, { status: 500 })
  }
}
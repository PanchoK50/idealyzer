"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Star,
  DollarSign,
  Target,
  Lightbulb,
  Download,
  Share,
  CheckCircle,
  XCircle,
  AlertCircle,
  Newspaper,
  ExternalLink,
  TrendingUpIcon,
} from "lucide-react"
import type { AnalysisResult } from "@/lib/analysis-frameworks"
import { VoiceSummary } from "@/components/voice-summary"

interface AnalysisResultsProps {
  result: AnalysisResult
  ideaTitle: string
}

export function AnalysisResults({ result, ideaTitle }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Prepare chart data
  const metricsData = [
    { name: "Desirability", value: result.frameworks.metrics.desirability },
    { name: "Viability", value: result.frameworks.metrics.viability },
    { name: "Feasibility", value: result.frameworks.metrics.feasibility },
    { name: "Sustainability", value: result.frameworks.metrics.sustainability },
  ]

  // Get top 3 most relevant news articles
  const topNewsArticles = result.industryNews.articles
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3)

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500"
    if (score >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (score >= 6) return <AlertCircle className="h-5 w-5 text-yellow-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getBCGIcon = (category: string) => {
    switch (category) {
      case "star":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "cash-cow":
        return <DollarSign className="h-5 w-5 text-green-500" />
      case "question-mark":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return <TrendingDown className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">{ideaTitle}</h1>
          <p className="text-muted-foreground mt-2">{result.summary}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Quality Score:{" "}
            <span className={`ml-2 font-bold ${getScoreColor(result.qualityScore)}`}>{result.qualityScore}/10</span>
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="business-model">Business Model</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="industry-news">Industry News</TabsTrigger>
          <TabsTrigger value="voice-summary">Voice Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metricsData.map((metric) => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        {getScoreIcon(metric.value)}
                        <span className={`font-bold ${getScoreColor(metric.value)}`}>{metric.value}/10</span>
                      </div>
                    </div>
                    <Progress value={metric.value * 10} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* BCG Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getBCGIcon(result.frameworks.bcg.category)}
                  BCG Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2 capitalize">
                      {result.frameworks.bcg.category.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Market Growth:</span>
                      <div className="font-semibold">{result.frameworks.bcg.marketGrowth}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Market Share:</span>
                      <div className="font-semibold">{result.frameworks.bcg.marketShare}%</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.frameworks.bcg.reasoning}</p>
                </div>
              </CardContent>
            </Card>

            {/* Industry News Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5" />
                  Industry Pulse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topNewsArticles.length > 0 ? (
                    topNewsArticles.map((article, index) => (
                      <div key={index} className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-1">{article.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.snippet}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{article.source}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{new Date(article.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Newspaper className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No industry news available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Strengths & Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-5 w-5" />
                  Challenges & Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Evaluation */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{result.evaluation}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-6">
          {/* SWOT Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>SWOT Analysis</CardTitle>
              <CardDescription>Strategic analysis of internal and external factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {result.frameworks.swot.strengths.map((item, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Opportunities</h4>
                    <ul className="space-y-1">
                      {result.frameworks.swot.opportunities.map((item, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <TrendingUp className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-yellow-600 mb-2">Weaknesses</h4>
                    <ul className="space-y-1">
                      {result.frameworks.swot.weaknesses.map((item, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <AlertCircle className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Threats</h4>
                    <ul className="space-y-1">
                      {result.frameworks.swot.threats.map((item, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <XCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Evaluation across key business dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={metricsData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Metrics Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Scores</CardTitle>
                <CardDescription>Individual metric performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business-model" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Model Canvas</CardTitle>
              <CardDescription>Comprehensive business model breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Partners</h4>
                    <ul className="text-sm space-y-1">
                      {result.frameworks.businessModel.keyPartners.map((item, index) => (
                        <li key={index} className="p-2 bg-muted rounded">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Activities</h4>
                    <ul className="text-sm space-y-1">
                      {result.frameworks.businessModel.keyActivities.map((item, index) => (
                        <li key={index} className="p-2 bg-muted rounded">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Resources</h4>
                    <ul className="text-sm space-y-1">
                      {result.frameworks.businessModel.keyResources.map((item, index) => (
                        <li key={index} className="p-2 bg-muted rounded">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Value Propositions</h4>
                    <ul className="text-sm space-y-1">
                      {result.frameworks.businessModel.valuePropositions.map((item, index) => (
                        <li key={index} className="p-2 bg-primary/10 rounded border border-primary/20">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Customer Relationships</h4>
                    <ul className="text-sm space-y-1">
                      {result.frameworks.businessModel.customerRelationships.map((item, index) => (
                        <li key={index} className="p-2 bg-muted rounded">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Channels</h4>
                    <ul className="text-sm space-y-1">
                      {result.frameworks.businessModel.channels.map((item, index) => (
                        <li key={index} className="p-2 bg-muted rounded">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Customer Segments</h4>
                    <ul className="text-sm space-y-1">
                      {result.frameworks.businessModel.customerSegments.map((item, index) => (
                        <li key={index} className="p-2 bg-muted rounded">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Cost Structure</h4>
                    <ul className="text-sm space-y-1">
                      {result.frameworks.businessModel.costStructure.map((item, index) => (
                        <li key={index} className="p-2 bg-muted rounded">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Revenue Streams</h4>
                    <ul className="text-sm space-y-1">
                      {result.frameworks.businessModel.revenueStreams.map((item, index) => (
                        <li key={index} className="p-2 bg-muted rounded">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Startup Names */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Suggested Names
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.recommendations.startupNames.map((name, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Brand Wheel */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Foundation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Mission</h4>
                  <p className="text-sm text-muted-foreground">{result.recommendations.brandWheel.mission}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Vision</h4>
                  <p className="text-sm text-muted-foreground">{result.recommendations.brandWheel.vision}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Values</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.recommendations.brandWheel.values.map((value, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Personality</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.recommendations.brandWheel.personality.map((trait, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Elevator Pitch */}
          <Card>
            <CardHeader>
              <CardTitle>Elevator Pitch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed italic">"{result.recommendations.elevatorPitch}"</p>
            </CardContent>
          </Card>

          {/* Action Plan */}
          <Card>
            <CardHeader>
              <CardTitle>100-Day Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {result.recommendations.actionPlan.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle>Key Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.recommendations.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industry-news" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Industry Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Industry Terms
                </CardTitle>
                <CardDescription>Relevant keywords for your market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.industryNews.industryKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUpIcon className="h-5 w-5" />
                  Market Trends
                </CardTitle>
                <CardDescription>Current industry dynamics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.industryNews.marketTrends.map((trend, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{trend}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competitive Landscape */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Competitive Landscape
                </CardTitle>
                <CardDescription>Market positioning insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{result.industryNews.competitiveLandscape}</p>
              </CardContent>
            </Card>
          </div>

          {/* News Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                Recent Industry News
              </CardTitle>
              <CardDescription>Latest developments in your industry</CardDescription>
            </CardHeader>
            <CardContent>
              {result.industryNews.articles.length > 0 ? (
                <div className="space-y-4">
                  {result.industryNews.articles.map((article, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium mb-2">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{article.snippet}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{article.source}</span>
                            <span>•</span>
                            <span>{new Date(article.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                              {Math.round(article.relevanceScore * 100)}% relevant
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No Industry News Available</h3>
                  <p className="text-sm">Industry news data could not be loaded at this time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice-summary" className="space-y-6">
          <VoiceSummary result={result} ideaTitle={ideaTitle} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

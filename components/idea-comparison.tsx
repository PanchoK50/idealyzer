"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { ArrowUpDown, Plus, X, Target } from "lucide-react"
import type { AnalysisResult } from "@/lib/analysis-frameworks"

interface IdeaComparisonData {
  id: string
  title: string
  result: AnalysisResult
  selected: boolean
}

interface ComparisonProps {
  ideas: IdeaComparisonData[]
  onAddIdea: () => void
  onRemoveIdea: (id: string) => void
}

export function IdeaComparison({ ideas, onAddIdea, onRemoveIdea }: ComparisonProps) {
  const [selectedIdeas, setSelectedIdeas] = useState<string[]>(ideas.slice(0, 3).map((idea) => idea.id))
  const [sortCriteria, setSortCriteria] = useState<"qualityScore" | "desirability" | "viability" | "feasibility">(
    "qualityScore",
  )
  const [viewMode, setViewMode] = useState<"table" | "radar" | "bar">("table")

  const selectedIdeaData = ideas.filter((idea) => selectedIdeas.includes(idea.id))

  const toggleIdeaSelection = (ideaId: string) => {
    setSelectedIdeas((prev) => (prev.includes(ideaId) ? prev.filter((id) => id !== ideaId) : [...prev, ideaId]))
  }

  const getSortedIdeas = () => {
    return [...selectedIdeaData].sort((a, b) => {
      switch (sortCriteria) {
        case "qualityScore":
          return b.result.qualityScore - a.result.qualityScore
        case "desirability":
          return b.result.frameworks.metrics.desirability - a.result.frameworks.metrics.desirability
        case "viability":
          return b.result.frameworks.metrics.viability - a.result.frameworks.metrics.viability
        case "feasibility":
          return b.result.frameworks.metrics.feasibility - a.result.frameworks.metrics.feasibility
        default:
          return 0
      }
    })
  }

  const getRadarData = () => {
    const metrics = ["desirability", "viability", "feasibility", "sustainability"]
    return metrics.map((metric) => {
      const dataPoint: any = { metric: metric.charAt(0).toUpperCase() + metric.slice(1) }
      selectedIdeaData.forEach((idea) => {
        dataPoint[idea.title] = idea.result.frameworks.metrics[metric as keyof typeof idea.result.frameworks.metrics]
      })
      return dataPoint
    })
  }

  const getBarData = () => {
    return selectedIdeaData.map((idea) => ({
      name: idea.title.length > 15 ? idea.title.substring(0, 15) + "..." : idea.title,
      qualityScore: idea.result.qualityScore,
      desirability: idea.result.frameworks.metrics.desirability,
      viability: idea.result.frameworks.metrics.viability,
      feasibility: idea.result.frameworks.metrics.feasibility,
      sustainability: idea.result.frameworks.metrics.sustainability,
    }))
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500"
    if (score >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  const getRankBadge = (index: number) => {
    const colors = ["bg-yellow-500", "bg-gray-400", "bg-amber-600"]
    const color = colors[index] || "bg-gray-300"
    return <Badge className={`${color} text-white`}>#{index + 1}</Badge>
  }

  if (ideas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Idea Comparison
          </CardTitle>
          <CardDescription>Compare multiple ideas to identify the most promising opportunities</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="text-muted-foreground mb-4">No ideas available for comparison yet.</div>
          <Button onClick={onAddIdea}>
            <Plus className="h-4 w-4 mr-2" />
            Analyze Your First Idea
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Idea Comparison Dashboard
          </CardTitle>
          <CardDescription>Compare and rank your ideas across multiple criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortCriteria} onValueChange={(value: any) => setSortCriteria(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualityScore">Quality Score</SelectItem>
                    <SelectItem value="desirability">Desirability</SelectItem>
                    <SelectItem value="viability">Viability</SelectItem>
                    <SelectItem value="feasibility">Feasibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">View:</label>
                <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="radar">Radar Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={onAddIdea} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Idea
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Idea Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Ideas to Compare</CardTitle>
          <CardDescription>Choose up to 5 ideas for detailed comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedIdeas.includes(idea.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => toggleIdeaSelection(idea.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Checkbox checked={selectedIdeas.includes(idea.id)} onChange={() => toggleIdeaSelection(idea.id)} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveIdea(idea.id)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <h4 className="font-semibold mb-2 text-balance">{idea.title}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Quality Score:</span>
                  <span className={`font-bold ${getScoreColor(idea.result.qualityScore)}`}>
                    {idea.result.qualityScore}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedIdeaData.length > 0 && (
        <>
          {/* Ranking Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Ranking by {sortCriteria.charAt(0).toUpperCase() + sortCriteria.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getSortedIdeas().map((idea, index) => (
                  <div key={idea.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      {getRankBadge(index)}
                      <div>
                        <h4 className="font-semibold">{idea.title}</h4>
                        <p className="text-sm text-muted-foreground">{idea.result.summary.substring(0, 100)}...</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(idea.result.qualityScore)}`}>
                        {sortCriteria === "qualityScore"
                          ? idea.result.qualityScore
                          : idea.result.frameworks.metrics[sortCriteria as keyof typeof idea.result.frameworks.metrics]}
                        /10
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sortCriteria === "qualityScore" ? "Overall" : sortCriteria}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comparison Views */}
          {viewMode === "table" && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison Table</CardTitle>
                <CardDescription>Side-by-side comparison of key metrics and characteristics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Criteria</TableHead>
                        {selectedIdeaData.map((idea) => (
                          <TableHead key={idea.id} className="text-center min-w-32">
                            {idea.title}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Quality Score</TableCell>
                        {selectedIdeaData.map((idea) => (
                          <TableCell key={idea.id} className="text-center">
                            <span className={`font-bold ${getScoreColor(idea.result.qualityScore)}`}>
                              {idea.result.qualityScore}/10
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Desirability</TableCell>
                        {selectedIdeaData.map((idea) => (
                          <TableCell key={idea.id} className="text-center">
                            <span className={`font-bold ${getScoreColor(idea.result.frameworks.metrics.desirability)}`}>
                              {idea.result.frameworks.metrics.desirability}/10
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Viability</TableCell>
                        {selectedIdeaData.map((idea) => (
                          <TableCell key={idea.id} className="text-center">
                            <span className={`font-bold ${getScoreColor(idea.result.frameworks.metrics.viability)}`}>
                              {idea.result.frameworks.metrics.viability}/10
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Feasibility</TableCell>
                        {selectedIdeaData.map((idea) => (
                          <TableCell key={idea.id} className="text-center">
                            <span className={`font-bold ${getScoreColor(idea.result.frameworks.metrics.feasibility)}`}>
                              {idea.result.frameworks.metrics.feasibility}/10
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sustainability</TableCell>
                        {selectedIdeaData.map((idea) => (
                          <TableCell key={idea.id} className="text-center">
                            <span
                              className={`font-bold ${getScoreColor(idea.result.frameworks.metrics.sustainability)}`}
                            >
                              {idea.result.frameworks.metrics.sustainability}/10
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">BCG Category</TableCell>
                        {selectedIdeaData.map((idea) => (
                          <TableCell key={idea.id} className="text-center">
                            <Badge variant="outline" className="capitalize">
                              {idea.result.frameworks.bcg.category.replace("-", " ")}
                            </Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Industry Keywords</TableCell>
                        {selectedIdeaData.map((idea) => (
                          <TableCell key={idea.id} className="text-center">
                            <span className="font-semibold">{idea.result.industryNews?.industryKeywords?.length || 0} keywords</span>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === "radar" && (
            <Card>
              <CardHeader>
                <CardTitle>Radar Chart Comparison</CardTitle>
                <CardDescription>Visual comparison of key metrics across all dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    {selectedIdeaData.map((idea, index) => (
                      <Radar
                        key={idea.id}
                        name={idea.title}
                        dataKey={idea.title}
                        stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                        fill={`hsl(${index * 137.5}, 70%, 50%)`}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    ))}
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {viewMode === "bar" && (
            <Card>
              <CardHeader>
                <CardTitle>Bar Chart Comparison</CardTitle>
                <CardDescription>Compare all metrics side-by-side for easy analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getBarData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="qualityScore" fill="#8b5cf6" name="Quality Score" />
                    <Bar dataKey="desirability" fill="#06b6d4" name="Desirability" />
                    <Bar dataKey="viability" fill="#10b981" name="Viability" />
                    <Bar dataKey="feasibility" fill="#f59e0b" name="Feasibility" />
                    <Bar dataKey="sustainability" fill="#ef4444" name="Sustainability" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IdeaComparison } from "@/components/idea-comparison"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Eye, Trash2, Lightbulb } from "lucide-react"
import type { AnalysisResult } from "@/lib/analysis-frameworks"

interface StoredIdea {
  id: string
  title: string
  result: AnalysisResult
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [ideas, setIdeas] = useState<StoredIdea[]>([])
  const [viewMode, setViewMode] = useState<"list" | "comparison">("list")

  useEffect(() => {
    // Load ideas from localStorage
    const storedIdeas = localStorage.getItem("analyzedIdeas")
    if (storedIdeas) {
      try {
        setIdeas(JSON.parse(storedIdeas))
      } catch (error) {
        console.error("Error loading stored ideas:", error)
      }
    }
  }, [])

  const saveIdeas = (updatedIdeas: StoredIdea[]) => {
    setIdeas(updatedIdeas)
    localStorage.setItem("analyzedIdeas", JSON.stringify(updatedIdeas))
  }

  const addNewIdea = () => {
    router.push("/analyze")
  }

  const viewIdeaDetails = (idea: StoredIdea) => {
    // Store the idea data for the results page
    sessionStorage.setItem("analysisResult", JSON.stringify(idea.result))
    sessionStorage.setItem("ideaData", JSON.stringify({ title: idea.title }))
    router.push("/results")
  }

  const removeIdea = (ideaId: string) => {
    const updatedIdeas = ideas.filter((idea) => idea.id !== ideaId)
    saveIdeas(updatedIdeas)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500"
    if (score >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (viewMode === "comparison") {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setViewMode("list")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Ideas List
            </Button>
          </div>

          <IdeaComparison
            ideas={ideas.map((idea) => ({ ...idea, selected: false }))}
            onAddIdea={addNewIdea}
            onRemoveIdea={removeIdea}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Ideas Dashboard</h1>
            <p className="text-muted-foreground">Manage and compare your analyzed startup ideas</p>
          </div>
          <div className="flex gap-3">
            {ideas.length > 1 && (
              <Button variant="outline" onClick={() => setViewMode("comparison")}>
                <Lightbulb className="h-4 w-4 mr-2" />
                Compare Ideas
              </Button>
            )}
            <Button onClick={addNewIdea}>
              <Plus className="h-4 w-4 mr-2" />
              Analyze New Idea
            </Button>
          </div>
        </div>

        {ideas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No ideas analyzed yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by analyzing your first startup idea to see comprehensive insights and recommendations.
              </p>
              <Button onClick={addNewIdea}>
                <Plus className="h-4 w-4 mr-2" />
                Analyze Your First Idea
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-balance mb-2">{idea.title}</CardTitle>
                      <CardDescription className="text-sm">Analyzed on {formatDate(idea.createdAt)}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      <span className={`font-bold ${getScoreColor(idea.result.qualityScore)}`}>
                        {idea.result.qualityScore}/10
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{idea.result.summary}</p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Desirability:</span>
                      <span className={`font-semibold ${getScoreColor(idea.result.frameworks.metrics.desirability)}`}>
                        {idea.result.frameworks.metrics.desirability}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Viability:</span>
                      <span className={`font-semibold ${getScoreColor(idea.result.frameworks.metrics.viability)}`}>
                        {idea.result.frameworks.metrics.viability}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Feasibility:</span>
                      <span className={`font-semibold ${getScoreColor(idea.result.frameworks.metrics.feasibility)}`}>
                        {idea.result.frameworks.metrics.feasibility}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Keywords:</span>
                      <span className="font-semibold">{idea.result.industryNews?.industryKeywords?.length || 0}</span>
                    </div>
                  </div>

                  {/* BCG Category */}
                  <div className="mb-4">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {idea.result.frameworks.bcg.category.replace("-", " ")}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => viewIdeaDetails(idea)} className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeIdea(idea.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BarChart3, Target, Zap, FileCheck, Users, TrendingUp, Shield } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced LLM processing of your ideas with vision model support for images and comprehensive PDF parsing.",
  },
  {
    icon: BarChart3,
    title: "Strategic Frameworks",
    description:
      "BCG Matrix, SWOT analysis, Business Model Canvas, and custom evaluation metrics for comprehensive assessment.",
  },
  {
    icon: Target,
    title: "Viability Scoring",
    description: "Desirability, viability, feasibility, and sustainability metrics with quality index scoring.",
  },
  {
    icon: Zap,
    title: "Industry Intelligence",
    description: "Real-time market trends, competitive landscape analysis, and industry news to inform your strategy.",
  },
  {
    icon: FileCheck,
    title: "Professional Reports",
    description: "Branded PDF reports with executive summaries, detailed analysis, and implementation guides.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Multi-user dashboards for comparing and ranking ideas across your innovation pipeline.",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Technology and market analysis with competitive landscape insights and trend identification.",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "Secure processing with custom branding options and integration with your existing workflows.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            Everything you need to validate breakthrough ideas
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            From initial concept to market-ready strategy, our AI-powered platform guides you through every step of idea
            validation and business planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card/50 hover:bg-card/80 transition-colors">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

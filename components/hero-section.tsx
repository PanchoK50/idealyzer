import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, FileText, ImageIcon } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
            Transform your <span className="text-primary">breakthrough ideas</span> into validated business
            opportunities
          </h1>

          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Upload your concepts, research, or pitch decks and get comprehensive AI-powered analysis using proven
            business frameworks like SWOT, BCG Matrix, and Business Model Canvas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/analyze">
              <Button size="lg" className="text-lg px-8">
                Start analyzing ideas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Input methods preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-lg border border-border bg-card/50">
              <Upload className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Upload Files</h3>
              <p className="text-sm text-muted-foreground text-center">PDFs, pitch decks, research papers</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg border border-border bg-card/50">
              <ImageIcon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Add Images</h3>
              <p className="text-sm text-muted-foreground text-center">Photos, sketches, product mockups</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg border border-border bg-card/50">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Describe Ideas</h3>
              <p className="text-sm text-muted-foreground text-center">Free text, notes, concepts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted by section */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-sm text-muted-foreground mb-8">TRUSTED BY INNOVATION TEAMS AT</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold">Stanford Research</div>
            <div className="text-lg font-semibold">MIT Innovation</div>
            <div className="text-lg font-semibold">Y Combinator</div>
            <div className="text-lg font-semibold">Techstars</div>
            <div className="text-lg font-semibold">500 Startups</div>
          </div>
        </div>
      </div>
    </section>
  )
}

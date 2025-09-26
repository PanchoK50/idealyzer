"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Download,
  Loader2,
  Clock,
  Mic
} from "lucide-react"
import type { AnalysisResult } from "@/lib/analysis-frameworks"

interface VoiceSummaryProps {
  result: AnalysisResult
  ideaTitle: string
}

type SummaryType = 'quick' | 'executive' | 'detailed'
type VoiceType = 'Rachel' | 'Drew' | 'Clyde' | 'Bella'

interface SummaryData {
  audioScript: string
  estimatedDuration: number
  keyPoints: string[]
}

export function VoiceSummary({ result, ideaTitle }: VoiceSummaryProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [summaryType, setSummaryType] = useState<SummaryType>('executive')
  const [voice, setVoice] = useState<VoiceType>('Rachel')
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  const handleGenerateAudio = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // First, generate the summary script
      const summaryResponse = await fetch('/api/analysis-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisResult: result,
          ideaTitle: ideaTitle,
          summaryType: summaryType
        }),
      })

      if (!summaryResponse.ok) {
        throw new Error('Failed to generate summary')
      }

      const summaryData: SummaryData = await summaryResponse.json()
      setSummaryData(summaryData)

      // Try ElevenLabs TTS first
      try {
        const ttsResponse = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: summaryData.audioScript,
            voice: voice,
            model: 'eleven_multilingual_v2'
          }),
        })

        if (ttsResponse.ok) {
          // ElevenLabs worked - create audio URL
          const audioBlob = await ttsResponse.blob()
          const url = URL.createObjectURL(audioBlob)
          setAudioUrl(url)
        } else {
          // ElevenLabs failed - try Web Speech API fallback
          const errorData = await ttsResponse.json()
          console.error('ElevenLabs TTS error:', errorData)

          if (errorData.error?.includes('missing_permissions') || errorData.error?.includes('API key')) {
            throw new Error(`ElevenLabs API Issue: ${errorData.error}. Please check your API key permissions at elevenlabs.io/app/settings`)
          } else {
            throw new Error('ElevenLabs TTS failed - check API key permissions')
          }
        }
      } catch (ttsError) {
        throw ttsError
      }

    } catch (err) {
      console.error('Audio generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate audio')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a')
      link.href = audioUrl
      link.download = `${ideaTitle.replace(/\s+/g, '_')}_analysis_summary.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Summary
        </CardTitle>
        <CardDescription>
          Listen to an AI-generated audio summary of your startup analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Summary Type</label>
            <Select value={summaryType} onValueChange={(value: SummaryType) => setSummaryType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quick">Quick (1-2 min)</SelectItem>
                <SelectItem value="executive">Executive (2-3 min)</SelectItem>
                <SelectItem value="detailed">Detailed (4-6 min)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Voice</label>
            <Select value={voice} onValueChange={(value: VoiceType) => setVoice(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rachel">Rachel (Professional Female)</SelectItem>
                <SelectItem value="Drew">Drew (Professional Male)</SelectItem>
                <SelectItem value="Clyde">Clyde (Mature Male)</SelectItem>
                <SelectItem value="Bella">Bella (Young Female)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateAudio}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Audio Summary...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Generate Voice Summary
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            <div className="font-semibold mb-2">Voice Generation Failed</div>
            <div>{error}</div>
            {error.includes('missing_permissions') && (
              <div className="mt-3 text-xs bg-red-100 p-2 rounded border">
                <strong>Solution:</strong> Go to <a href="https://elevenlabs.io/app/settings" target="_blank" rel="noopener noreferrer" className="underline">ElevenLabs Settings</a> → API Keys → Generate a new key with "Text-to-Speech" permissions enabled
              </div>
            )}
          </div>
        )}

        {/* Summary Info */}
        {summaryData && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Est. {formatDuration(summaryData.estimatedDuration)}
              </div>
              <Badge variant="outline">{summaryType} summary</Badge>
              <Badge variant="outline">{voice} voice</Badge>
            </div>

            {/* Key Points Preview */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Key Points:</h4>
              <div className="flex flex-wrap gap-1">
                {summaryData.keyPoints.map((point, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {point}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audio Controls */}
        {audioUrl && (
          <div className="space-y-3">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={() => {
                // Audio is ready to play
              }}
            />

            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={!audioUrl}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleStop}
                disabled={!audioUrl}
              >
                <Square className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleMute}
                disabled={!audioUrl}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!audioUrl}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Click play to listen to your analysis summary
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
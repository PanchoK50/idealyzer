import { type NextRequest, NextResponse } from "next/server"

export interface TTSRequest {
  text: string
  voice?: string
  model?: string
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured. Please add ELEVENLABS_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    const { text, voice = "Rachel", model = "eleven_multilingual_v2" } = await request.json() as TTSRequest

    if (!text || text.length === 0) {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      )
    }

    // ElevenLabs voice IDs (you can get these from your ElevenLabs dashboard)
    const voiceIds = {
      "Rachel": "21m00Tcm4TlvDq8ikWAM", // Professional female voice
      "Drew": "29vD33N1CtxCmqQRPOHJ",  // Professional male voice
      "Clyde": "2EiwWnXFnvU5JabPnv8n", // Middle-aged male voice
      "Bella": "EXAVITQu4vr4xnSDxMaL",  // Young female voice
    }

    const selectedVoiceId = voiceIds[voice as keyof typeof voiceIds] || voiceIds.Rachel

    // Call ElevenLabs API
    const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.5,
          use_speaker_boost: true
        }
      }),
    })

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text()
      console.error('ElevenLabs API error:', errorText)
      return NextResponse.json(
        { error: `ElevenLabs API error: ${elevenLabsResponse.status}` },
        { status: elevenLabsResponse.status }
      )
    }

    // Get the audio data as buffer
    const audioBuffer = await elevenLabsResponse.arrayBuffer()

    // Return the audio data with proper headers
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })

  } catch (error) {
    console.error("Text-to-speech error:", error)
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "GET method not allowed. Use POST with text content." },
    { status: 405 }
  )
}
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import axios from "axios"
export async function POST(request: NextRequest) {
  const data = await request.json()

  const videoPath = data.videoPath
  try {
    const transcribeResponse = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        file: fs.createReadStream(videoPath),
        model: "whisper-1",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAT_GPT_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )

    const transcription = transcribeResponse.data.text

    return NextResponse.json({
      transcription: transcription,
    })
  } catch (error: any) {
    return new Response(JSON.stringify(error.response?.data?.error), {
      status: error.response?.status,
    })
  }
}

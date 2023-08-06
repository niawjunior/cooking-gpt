import { NextRequest, NextResponse } from "next/server"
export async function GET(
  request: NextRequest,
  context: { params: { keywords: string } }
) {
  const keywords = context?.params?.keywords
  try {
    const SEARCH_API_URL = "https://www.googleapis.com/youtube/v3/search"
    const MAX_RESULTS = "6"
    const params = new URLSearchParams({
      key: process.env.YOUTUBE_API_KEY!,
      part: "snippet",
      type: "video",
      q: keywords,
      maxResults: MAX_RESULTS,
      videoEmbeddable: "true",
    })

    const response = await fetch(`${SEARCH_API_URL}?${params.toString()}`)
    const data = await response.json()

    const videoLinks = data.items.map(
      (item: any) => `https://www.youtube.com/watch?v=${item.id.videoId}`
    )

    return NextResponse.json({
      videos: videoLinks,
    })
  } catch (error: any) {
    return new Response(JSON.stringify(error.response?.data?.error), {
      status: error.response?.status,
    })
  }
}

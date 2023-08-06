"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCallback, useEffect, useState } from "react"
import { ReloadIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"

function extractYouTubeVideoId(url: string) {
  const regex =
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/
  const match = url.match(regex)
  if (match) {
    return match[1]
  }
  return null
}

function isValidYouTubeUrl(url: string) {
  const youtubeUrlPattern =
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/
  return youtubeUrlPattern.test(url)
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [detail, setDetail] = useState<any>(null)
  const [language, setLanguage] = useState<any>("th")
  const [isYoutube, setIsYoutube] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [youtubeLists, setYoutubeLists] = useState<string[]>([])
  const [summarizeLoading, setSummarizeLoading] = useState<boolean>(false)

  const [summarizeDetail, setSummarizeDetail] = useState<any>(null)

  const Transcribe = async (videoPath: string) => {
    const chatGPTResponse = await fetch(`/api/transcribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoPath: videoPath,
      }),
    })
    return chatGPTResponse
  }
  const Summarize = async (transcription: string) => {
    const summarizeResponse = await fetch(`/api/chatgpt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: transcription,
        isYoutube: true,
        language: language,
      }),
    })
    return summarizeResponse
  }

  const HowToCook = async (menu: string) => {
    const summarizeResponse = await fetch(`/api/chatgpt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: menu,
        isYoutube: false,
        language: language,
      }),
    })
    return summarizeResponse
  }

  const YoutubeRelatedVideos = async (keywords: string, language: string) => {
    const searchYouTuberRsponse = await fetch(
      `/api/related/${keywords}/${language}`
    )
    return searchYouTuberRsponse
  }
  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true)
    setYoutubeLists([])
    event.preventDefault()
    setIsYoutube(isValidYouTubeUrl(url))
    if (isValidYouTubeUrl(url)) {
      const youtubeId = extractYouTubeVideoId(url)
      const response = await fetch(`/api/youtube/${youtubeId}`)
      const result = await response.json()
      setDetail(result)
      setLoading(false)
      setSummarizeLoading(true)

      const chatGPTResponse = await Transcribe(result.videoPath)
      const chatGPTData = await chatGPTResponse.json()
      const summarizeResponse = await Summarize(chatGPTData.transcription)
      const summarizeData = await summarizeResponse.json()
      setSummarizeDetail(JSON.parse(summarizeData.summarize))
      setSummarizeLoading(false)
    } else {
      setSummarizeLoading(true)
      const summarizeResponse = await HowToCook(url)
      const summarizeData = await summarizeResponse.json()

      setSummarizeDetail(JSON.parse(summarizeData.summarize))
      setLoading(false)
      setSummarizeLoading(false)
      const searchYouTuberRsponse = await YoutubeRelatedVideos(url, language)
      const searchYouTuberResult = await searchYouTuberRsponse.json()

      const mapVideoIds = searchYouTuberResult.videos.map((item: string) => {
        return extractYouTubeVideoId(item)
      })
      setYoutubeLists(mapVideoIds)
    }
  }

  const handleOnChange = (e: any) => {
    setLanguage(e)
  }

  return (
    <div className="bg-cover  bg-center bg-robot2">
      <div className="backdrop-blur-sm backdrop-brightness-50 flex flex-col justify-start items-center py-10 min-h-screen">
        {/* <div>
          <Image
            src={"/robot.png"}
            alt="robot"
            height={50}
            width={50}
            className="rounded-full"
          />
        </div> */}
        <div className="font-bold text-4xl text-white mb-6 shadow-lg ">
          Cooking.GPT
        </div>

        <form
          onSubmit={(e) => handleSubmit(e)}
          className="w-1/2 flex justify-center"
        >
          <div className="flex min-w-full max-w-sm items-center space-x-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="text"
              placeholder="Please search with a YouTube link or a cooking menu."
            />
            <Select
              onValueChange={(e) => handleOnChange(e)}
              defaultValue={language}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="เลือกภาษา" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="th">Thai</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              disabled={loading}
              className="bg-blue-500 w-30 hover:bg-blue-700"
              type="submit"
            >
              Search
              {loading && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
              {!loading && <MagnifyingGlassIcon className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
        <div className="container flex justify-around mt-6 gap-4">
          {isYoutube && (
            <div className="w-1/2">
              {detail && (
                <>
                  <div className="text-white font-bold">
                    Title: {detail?.name}
                  </div>
                  <iframe
                    className="mt-4"
                    width="600"
                    height="400"
                    src={`https://www.youtube.com/embed/${detail?.id}`}
                    title={detail?.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </>
              )}
            </div>
          )}
          <div className="w-1/2">
            {summarizeLoading && (
              <>
                <div className="text-white">Loading...</div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </>
            )}
            {summarizeDetail && !summarizeLoading && (
              <div className="backdrop-brightness-30 bg-slate-500/30 rounded-md px-10 py-4">
                <div className="text-white text-2xl font-bold flex mb-4">
                  Summarize
                </div>
                <div className="flex gap-12">
                  <div className="text-white w-full">
                    <div className="text-white font-bold text-lg">
                      Menu: {summarizeDetail?.title}
                    </div>

                    <ul className="list-disc break-words mt-4">
                      {summarizeDetail?.steps.map(
                        (item: string, index: number) => (
                          <li key={index}>{item}</li>
                        )
                      )}
                    </ul>
                    <div>{summarizeDetail?.conclusion}</div>
                  </div>

                  <div className="text-white w-full">
                    <div className="text-white font-bold flex text-lg">
                      Ingredients
                    </div>
                    <ul className="list-disc break-words mt-4 text-white">
                      {summarizeDetail?.ingredients.map(
                        (item: string, index: number) => (
                          <li key={index}>{item}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          {youtubeLists.length > 0 && (
            <div className="w-1/2 backdrop-brightness-30 bg-slate-500/30 rounded-md px-4 py-4">
              <div className="text-white text-2xl font-bold flex">
                Related Videos
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {youtubeLists.map((item, index) => (
                  <iframe
                    key={index}
                    className="mt-4"
                    width="auto"
                    height="auto"
                    src={`https://www.youtube.com/embed/${item}`}
                    title={item}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

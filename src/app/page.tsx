"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCallback, useEffect, useState } from "react"
import { ReloadIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true)
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
      console.log(JSON.parse(summarizeData.summarize))
    }
  }

  const handleOnChange = (e: any) => {
    setLanguage(e)
  }

  return (
    <div className="min-h-screen bg-slate-700 flex flex-col justify-start items-center py-10">
      <div className="font-bold text-3xl text-white mb-6">ครัว.GPT</div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-1/2 flex justify-center"
      >
        <div className="flex min-w-full max-w-sm items-center space-x-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="text"
            placeholder="กรุณาพิมพ์ ลิงค์วีดีโอ หรือ เมนูอาหาร ที่ต้องการจะทำ"
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
                <SelectItem value="th">ไทย</SelectItem>
                <SelectItem value="en">อังกฤษ</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            disabled={loading}
            className="bg-blue-500 w-30 hover:bg-blue-700"
            type="submit"
          >
            ค้นหา
            {loading && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
            {!loading && <MagnifyingGlassIcon className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
      <div className="container flex justify-around mt-6">
        {isYoutube && (
          <div className="w-1/2">
            {detail && (
              <>
                <div className="text-white font-bold">
                  รายละเอียด: {detail?.name}
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
              <div className="flex items-center space-x-4 mt-4">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </>
          )}
          {summarizeDetail && !summarizeLoading && (
            <>
              <div className="text-white font-bold flex">สรุป</div>
              <div className="p-4 rounded-md text-white">
                <div>ชื่อเมนู {summarizeDetail?.title}</div>
                <ul className="list-disc mt-4">
                  {summarizeDetail?.steps.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div>{summarizeDetail?.conclusion}</div>
              </div>
              <div className="text-white font-bold flex">สิ่งที่ต้องไปซื้อ</div>
              <ul className="list-disc mt-4 text-white">
                {summarizeDetail?.ingredients.map(
                  (item: string, index: number) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

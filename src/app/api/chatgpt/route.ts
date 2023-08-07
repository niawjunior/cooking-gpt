import { NextRequest, NextResponse } from "next/server"

const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
  apiKey: process.env.CHAT_GPT_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(request: NextRequest) {
  const data = await request.json()
  try {
    let promptTh = ""
    let promptEn = ""
    let systemPromptTh = ""
    let systemPromptEn = ""
    if (data.isYoutube) {
      promptTh = data.text

      promptEn = data.text

      systemPromptTh =
        'คุณจะให้ขั้นตอนทั้งหมดมา และ งานของคุณคือ ช่วยสรุป และให้คำแนะนำในการทำอาหาร ทีละขั้นตอนแบบละเอียด หรือ เป็นหัวข้อย่อย พร้อมบอกสิ่งที่ต้องไปซื้อ เพื่อง่ายต่อการทำตาม และให้คำตอบเป็น json format ตามนี้ {title: "", steps: [], ingredients, conclusion: ""}'
      systemPromptEn =
        'You will provide all the steps, and your task is to summarize and provide guidance on cooking, detailing each step or subheading along with the necessary ingredients to make it easy to follow. You should also provide the response in JSON format as follows: {title: "", steps: [], ingredients, conclusion: ""}'
    } else {
      promptTh = data.text

      promptEn = data.text

      systemPromptTh =
        'คุณจะให้เมนู หรือชื่อ อาหารมา งานของคุณคือ บอกขั้นตอน และให้คำแนะนำในการทำอาหาร ทีละขั้นตอนแบบละเอียด หรือ เป็นหัวข้อย่อย พร้อมบอกสิ่งที่ต้องไปซื้อ เพื่อง่ายต่อการทำตาม และให้คำตอบเป็น json format ตามนี้ {title: "", steps: [], ingredients, conclusion: ""}'

      systemPromptEn =
        'You will provide menus or food names. Your task is to give step-by-step instructions and provide guidance on cooking, detailing each step or subheading along with the necessary ingredients to make it easy to follow. You should also provide the response in JSON format as follows: {title: "", steps: [], ingredients, conclusion: ""}.'
    }

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: data.language === "th" ? systemPromptTh : systemPromptEn,
          },
          {
            role: "user",
            content: data.language === "th" ? promptTh : promptEn,
          },
        ],
        n: 1,
        stream: false,
        stop: null,
        temperature: 0.7,
        top_p: 1,
      })
      console.log(response.data.choices)
      const answer =
        response.data.choices[0]?.message?.content || "Sorry I don't know"
      return NextResponse.json({
        summarize: JSON.parse(JSON.stringify(answer)),
      })
    } catch (error) {
      throw error
    }
  } catch (error: any) {
    return new Response(JSON.stringify(error.response?.data?.error), {
      status: error.response?.status,
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await openai.listModels()
    return NextResponse.json({
      models: response.data.data,
    })
  } catch (error: any) {
    return new Response(JSON.stringify(error.response?.data?.error), {
      status: error.response?.status,
    })
  }
}

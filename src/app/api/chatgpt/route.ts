import { NextRequest, NextResponse } from "next/server"

const { Configuration, OpenAIApi } = require("openai")

export async function POST(request: NextRequest) {
  const data = await request.json()
  try {
    const configuration = new Configuration({
      apiKey: "",
    })

    const openai = new OpenAIApi(configuration)

    const promptTh = `โปรดช่วยสรุป คำแนะนำในการทำอาหาร ต่อไปนี้เป็นคำแนะนำ ทีละขั้นตอนแบบละเอียด หรือ เป็นหัวข้อย่อย เพื่อง่ายต่อการทำตาม ให้คำตอบเป็น json format {title: "", steps: [], conclusion: ""} เพื่อนำไปใช้งานต่อได้ง่าย:\n\n${data.text}`
    const promptEn = `Please summarize the following cooking instructions as a step-by-step guide or in bullet points for easy follow and pls answer with json format {title: "", steps: [], conclusion: ""} for easy to use it further:\n\n${data.text}`

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: data.language === "th" ? promptTh : promptEn,
          },
        ],
        n: 1,
        stream: false,
        stop: null,
        temperature: 0,
        top_p: 1,
      })
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

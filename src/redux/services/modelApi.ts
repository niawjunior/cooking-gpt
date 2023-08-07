import { IModel } from "@/interfaces/IModel"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const modelApi = createApi({
  reducerPath: "modelApi",
  refetchOnFocus: false,
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  endpoints: (builder) => ({
    getModel: builder.query<IModel, {}>({
      query: ({}) => "chatgpt",
    }),
  }),
})

export const { useGetModelQuery } = modelApi

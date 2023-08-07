import {
  Middleware,
  MiddlewareAPI,
  applyMiddleware,
  configureStore,
  isRejectedWithValue,
} from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/dist/query"
import flowReducer from "@/redux/features/flowSlice"

import { modelApi } from "@/redux/services/modelApi"

// import { useGetModelQuery } from "@/redux/services/getModelApi"

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    const { dispatch } = api

    return next(action)
  }

const middlewareEnhancer = applyMiddleware(rtkQueryErrorLogger)

export const store = configureStore({
  reducer: {
    flowReducer,
    [modelApi.reducerPath]: modelApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat(modelApi.middleware),
  enhancers: [middlewareEnhancer],
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

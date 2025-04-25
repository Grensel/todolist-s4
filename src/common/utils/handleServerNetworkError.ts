import { setAppErrorAC, setAppStatusAC } from "@/app/app-slice"
import { Dispatch } from "@reduxjs/toolkit"
import axios from "axios"
import { z } from "zod"

export const handleServerNetworkError = (error: unknown, dispatch: Dispatch) => {
  let errorMessage
  switch (true) {
    case axios.isAxiosError(error):
      errorMessage = error.response?.data?.massage || error.message
      break
    case error instanceof z.ZodError:
      console.table(error.issues)
      errorMessage = "Zod error. Смотри консоль"
      break
    case error instanceof Error:
      errorMessage = error.message
      break
    default:
      errorMessage = JSON.stringify(error)
  }

  dispatch(setAppErrorAC({ error: errorMessage }))
  dispatch(setAppStatusAC({ status: "failed" }))
}

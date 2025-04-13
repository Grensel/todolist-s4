import { setAppErrorAC, setAppStatusAC } from "@/app/app-slice"
import { Dispatch } from "@reduxjs/toolkit"
import axios from "axios"

export const handleServerNetworkError = (error: unknown, dispatch: Dispatch) => {
  let errorMessage
  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data?.massage || error.message
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = JSON.stringify(error)
  }
  dispatch(setAppErrorAC({ error: errorMessage }))
  dispatch(setAppStatusAC({ status: "failed" }))
}

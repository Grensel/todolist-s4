import { Inputs } from "../lib/schemas"

export type LoginArgs = Inputs & {
  captcha?: string
}

export type MeResponse = {
  id: number
  email: string
  login: string
}

export type LoginResponse = {
  userId: number
  token: string
}

import { Inputs } from "../lib/schemas"

export type LoginArgs = Inputs & {
  captcha?: string
}

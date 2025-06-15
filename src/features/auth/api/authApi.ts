import type { BaseResponse } from "@/common/types"
import type { LoginArgs, LoginResponse, MeResponse } from "./authApi.types"
import { baseApi } from "@/app/baseApi"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<BaseResponse<MeResponse>, void>({
      query: () => "auth/me",
    }),
    login: build.mutation<BaseResponse<LoginResponse>, LoginArgs>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),
    logout: build.mutation<BaseResponse, void>({
      query: () => ({
        url: "auth/login",
        method: "DELETE",
      }),
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi

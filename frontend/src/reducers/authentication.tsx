//

import React, { useReducer } from "react"

let token = localStorage.getItem("prevozniciJWT")

type AuthType = {
  user: {}
  token: string
  loading: boolean
  errorMessage: string
}

export const initialState = {
  user: {},
  token: token || "",
  loading: false,
  errorMessage: ""
}

type ActionType = {
  type: string
  payload: any
}

export const AuthReducer = (initialState: AuthType, action: ActionType) => {
  switch (action.type) {
    case "REQUEST_AUTH":
      return {
        ...initialState,
        loading: true
      }
    case "HANDLE_LOGIN":
      return {
        ...initialState,
        user: action.payload.user,
        token: action.payload.auth_token,
        loading: false
      }
    case "LOGOUT":
      return {
        ...initialState,
        loading: false,
        user: {},
        token: ""
      }

    case "LOGIN_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.payload
      }

    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

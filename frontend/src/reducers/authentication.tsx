//

import React, { useReducer } from "react"

let token = localStorage.getItem("prevozniciJWT")

type AuthType = {
  userDetails: {}
  token: string
  loading: boolean
  errorMessage: string
}

export const initialState = {
  userDetails: {},
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
    case "REQUEST_LOGIN":
      return {
        ...initialState,
        loading: true
      }
    case "LOGIN_SUCCESS":
      return {
        ...initialState,
        user: action.payload.user,
        token: action.payload.auth_token,
        loading: false
      }
    case "LOGOUT":
      return {
        ...initialState,
        user: "",
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

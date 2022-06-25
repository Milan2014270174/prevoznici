import { setToken } from "../axios/axiosClient"

let token = localStorage.getItem("prevozniciJWT")

export type User = {
  id: number
  name: string
  email: string
  role_id: number
}

type AuthType = {
  user: User | {}
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
      setToken()
      return {
        ...initialState,
        user: action.payload.user,
        token: action.payload.token,
        loading: false
      }
    case "LOGOUT":
      localStorage.removeItem("prevozniciJWT")
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

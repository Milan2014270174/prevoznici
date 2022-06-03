/*context.tsx*/

import React, { createContext, useReducer } from "react"
import { AuthReducer, initialState } from "../reducers/authentication"

const AuthStateContext = createContext(initialState)
const AuthDispatchContext = createContext<React.Dispatch<any>>(() => null)

export function useAuthState() {
  const context = React.useContext(AuthStateContext)
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider")
  }

  return context
}

export function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext)
  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within a AuthProvider")
  }

  return context
}

interface Children {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: Children) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState)

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

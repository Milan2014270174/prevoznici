import { Navigate } from "react-router-dom"

interface RouteProps {
  Component: JSX.Element
  isAuthenticated: boolean
}

function PublicRoute({ Component, isAuthenticated }: RouteProps) {
  return !isAuthenticated ? (
    Component
  ) : (
    <Navigate
      replace
      to={{
        pathname: "/"
        // state: { from: location },
      }}
    />
  )
}

export default PublicRoute

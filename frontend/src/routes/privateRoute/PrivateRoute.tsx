import { Navigate } from "react-router-dom"

interface RouteProps {
  Component: JSX.Element | JSX.Element[]
  isAuthenticated: boolean
}

const PrivateRoute = ({ Component, isAuthenticated }: RouteProps) => {
  return isAuthenticated ? (
    Component
  ) : (
    <Navigate
      replace
      to={{
        pathname: "/login"
        // state: { from: location },
      }}
    />
  )
}

export default PrivateRoute

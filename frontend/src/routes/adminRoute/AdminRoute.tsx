import { Navigate } from "react-router-dom"

interface RouteProps {
  Component: JSX.Element | JSX.Element[]
  isAuthenticated: boolean
  isAdmin: boolean
}

const AdminRoute = ({ Component, isAuthenticated, isAdmin }: RouteProps) => {
  return isAuthenticated && isAdmin ? (
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

export default AdminRoute

import { Navigate } from "react-router-dom"

interface RouteProps {
  Component: JSX.Element
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
      }}
    />
  )
}

export default AdminRoute

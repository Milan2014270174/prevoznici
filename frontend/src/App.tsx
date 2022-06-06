import { useContext, useEffect, useState } from "react"
import { useAuthState } from "./context/authentication"
import "./App.css"
import { Routes, Route } from "react-router-dom"
import PublicRoute from "./routes/publicRoute/PublicRoute"
import PrivateRoute from "./routes/privateRoute/PrivateRoute"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import AppWrapper from "./components/AppWrapper/AppWrapper"
import Loading from "./components/Loading/Loading"
import Register from "./pages/Register/Register"
import Reservations from "./pages/Reservations/Reservations"
import Prevoznici from "./pages/Prevoznici/Prevoznici"

function App() {
  const [loading, setLoading] = useState(true)
  const user = useAuthState()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    console.log(user)
    if (user.token) {
      console.log("uzmi korisnika")
    } else {
      setLoggedIn(false)
    }
    setLoading(false)
  }, [user])
  return (
    <div className="App">
      {!loading ? (
        <Routes>
          <Route path="/" element={<AppWrapper />}>
            <Route index element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute Component={<Login />} isAuthenticated={loggedIn} />
              }
            />
            <Route
              path="/registracija"
              element={
                <PublicRoute
                  Component={<Register />}
                  isAuthenticated={loggedIn}
                />
              }
            />
            <Route
              path="/prevoznici"
              element={
                <PublicRoute
                  Component={<Prevoznici />}
                  isAuthenticated={loggedIn}
                />
              }
            />
            <Route
              path="/rezervacije"
              element={
                <PublicRoute
                  Component={<Reservations />}
                  isAuthenticated={loggedIn}
                />
              }
            />
          </Route>
        </Routes>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default App

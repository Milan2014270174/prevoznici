import { useContext, useEffect, useState } from "react"
import { useAuthDispatch, useAuthState } from "./context/authentication"
import "./App.css"
import { Routes, Route } from "react-router-dom"
import PublicRoute from "./routes/publicRoute/PublicRoute"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import AppWrapper from "./components/AppWrapper/AppWrapper"
import Loading from "./components/Loading/Loading"
import Register from "./pages/Register/Register"
import Reservations from "./pages/Reservations/Reservations"
import Prevoznici from "./pages/Prevoznici/Prevoznici"
import axiosClient from "./axios/axiosClient"

function App() {
  const dispatch = useAuthDispatch()
  const [loading, setLoading] = useState(true)
  const user = useAuthState()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    console.log(user.loading)
    if (loggedIn && user.user) {
      setLoading(false)
      return
    } else if (user.token && !loggedIn) {
      console.log("uzmi korisnika")
      axiosClient
        .get("/user/me")
        .then((res) => {
          dispatch({
            type: "HANDLE_LOGIN",
            payload: { user: res.data.clientData, auth_token: user.token }
          })
          setLoggedIn(true)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      setLoggedIn(false)
    }
    setLoading(false)
  }, [user])
  return (
    <div className="App">
      {loading || user.loading ? (
        <div className="fixed-center">
          <Loading />
        </div>
      ) : (
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
      )}
    </div>
  )
}

export default App

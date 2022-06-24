import { useEffect, useState } from "react"
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

import PrivateRoute from "./routes/privateRoute/PrivateRoute"

function App() {
  const dispatch = useAuthDispatch()
  const [loading, setLoading] = useState(true)
  const auth = useAuthState()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    console.log("auth change", auth)
    if (loggedIn && Object.keys(auth.user).length > 0) {
      setLoading(false)
      return
    } else if (auth.token && !loggedIn) {
      console.log("uzmi korisnika")
      axiosClient
        .get("/user/me")
        .then((res) => {
          dispatch({
            type: "HANDLE_LOGIN",
            payload: { user: res.data.clientData, token: auth.token }
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
  }, [auth])

  return (
    <div className="App">
      {loading || auth.loading ? (
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
            <Route path="/prevoznici" element={<Prevoznici />} />
            <Route
              path="/rezervacije"
              element={
                <PrivateRoute
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

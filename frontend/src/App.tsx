import React from "react"
import "./App.css"
import { Routes, Route } from "react-router-dom"
import PublicRoute from "./routes/publicRoute/PublicRoute"
import PrivateRoute from "./routes/privateRoute/PrivateRoute"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import AppWrapper from "./components/AppWrapper/AppWrapper"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route>
          <Route path="/" element={<AppWrapper />}>
            <Route index element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute Component={<Login />} isAuthenticated={false} />
              }
            />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App

import React from "react"
import "./app-wrapper.css"
import Navbar from "../Navbar/Navbar"
import { Outlet } from "react-router-dom"

const AppWrapper = () => {
  return (
    <div className="app-wrapper">
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  )
}

export default AppWrapper

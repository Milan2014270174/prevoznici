import React, { useState, useEffect } from "react"
import "./prevoznici.css"
import axiosClient from "../../axios/axiosClient"

const Prevoznici = () => {
  const [prevoznici, setPrevoznici] = useState()
  useEffect(() => {
    axiosClient
      .get("/companies/all")
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  return (
    <div className="container py-5">
      <h1>Prevoznici</h1>
    </div>
  )
}

export default Prevoznici

import React, { useState, useEffect } from "react"
import "./login.css"
import axiosClient from "../../axios/axiosClient"

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    error: false
  })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (
      !input.email ||
      !input.password ||
      /^\s*$/.test(input.email) ||
      /^\s*$/.test(input.password)
    ) {
      setInput({ ...input, error: true })
    } else {
      console.log("submit")
      axiosClient
        .post("/auth/login", { email: input.email, password: input.password })
        .then((res) => {
          console.log(res.data)
        })
        .catch((err) => {
          console.log("err", err)
        })
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <form onSubmit={handleSubmit} className="mb-3 needs-validation ">
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              className={`form-control ${
                input.email === "" && input.error ? "is-invalid" : ""
              }`}
              id="exampleInputEmail1"
              value={input.email}
              onChange={handleChange}
              aria-describedby="emailHelp"
            />
            {input.email === "" && input.error ? (
              <div className="invalid-feedback" style={{ display: "unset" }}>
                Email polje je obavezno.
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Šifra
            </label>
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={(e) => handleChange(e)}
              className={`form-control ${
                input.password === "" && input.error ? "is-invalid" : ""
              }`}
              id="exampleInputPassword1"
            />
            {input.password === "" && input.error ? (
              <div className="invalid-feedback" style={{ display: "unset" }}>
                Šifra je obavezna.
              </div>
            ) : (
              ""
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <p className="fw-light">
          Ukoliko nemate nalog, registrujte se klikom na link{" "}
          <a href="/registracija">Registracija</a>
        </p>
      </div>
    </div>
  )
}

export default Login

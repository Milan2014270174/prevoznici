import React, { useState, useEffect } from "react"
import "./register.css"
import axiosClient from "../../axios/axiosClient"
import { useAuthDispatch } from "../../context/authentication"

const Register = () => {
  const [input, setInput] = useState({
    name: "",
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
      !input.name ||
      !input.email ||
      !input.password ||
      /^\s*$/.test(input.name) ||
      /^\s*$/.test(input.email) ||
      /^\s*$/.test(input.password)
    ) {
      setInput({ ...input, error: true })
    } else {
      console.log("submit")
      axiosClient
        .post("/auth/register", {
          name: input.name,
          email: input.email,
          password: input.password
        })
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
              Ime
            </label>
            <input
              type="text"
              name="name"
              className={`form-control ${
                input.name === "" && input.error ? "is-invalid" : ""
              }`}
              id="exampleInputText1"
              value={input.name}
              onChange={handleChange}
              aria-describedby="textHelp"
            />
            {input.email === "" && input.error ? (
              <div className="invalid-feedback" style={{ display: "unset" }}>
                Ime je obavezno polje.
              </div>
            ) : (
              ""
            )}
          </div>
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
            Register
          </button>
        </form>
        <p className="fw-light">
          Ukoliko imate nalog, ulogujte se klikom na link{" "}
          <a href="/login">Login</a>
        </p>
      </div>
    </div>
  )
}

export default Register

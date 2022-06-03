import { useState } from "react"
import { useAuthState } from "../../context/authentication"
import "./navbar.css"
import { NavLink } from "react-router-dom"

const Navbar = () => {
  const user = useAuthState()
  const [menu, setMenu] = useState(false)
  function openMenu() {
    setMenu(!menu)
  }

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <NavLink className={`navbar-brand`} aria-current="page" to="/">
          AutobuskeKarte
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => openMenu()}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <div
          className={`${menu ? "" : "collapse"} navbar-collapse`}
          id="navbarSupportedContent"
        >
          <div className="p-2">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => openMenu()}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link active ${isActive ? "active" : ""}`
                }
                aria-current="page"
                to="/"
              >
                Početna
              </NavLink>
            </li>
            {user.token == "" ? (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link active ${isActive ? "active" : ""}`
                  }
                  aria-current="page"
                  to="/login"
                >
                  Login
                </NavLink>
              </li>
            ) : (
              ""
            )}

            <li className="nav-item">
              <a className="nav-link disabled" href="#" aria-disabled="true">
                Disabled
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar

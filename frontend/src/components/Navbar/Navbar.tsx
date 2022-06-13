import { useState } from "react"
import { useAuthDispatch, useAuthState } from "../../context/authentication"
import "./navbar.css"
import { NavLink } from "react-router-dom"
import { User } from "../../reducers/authentication"

const Navbar = () => {
  const dispatch = useAuthDispatch()

  const user: User | any = useAuthState().user

  const [menu, setMenu] = useState(false)

  const [userSubmenu, setUserSubmenu] = useState(false)

  function openMenu() {
    setMenu(!menu)
  }

  function logout() {
    dispatch({ type: "REQUEST_AUTH" })
    setTimeout(() => {
      dispatch({ type: "LOGOUT" })
    }, 2000)
  }

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid container">
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
          <ul className="navbar-nav w-100 mb-2 mb-lg-0 justify-content-end">
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
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link active ${isActive ? "active" : ""}`
                }
                aria-current="page"
                to="/prevoznici"
              >
                Prevoznici
              </NavLink>
            </li>
            {Object.keys(user).length > 0 && user.role_id === 1 ? (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link active ${isActive ? "active" : ""}`
                  }
                  aria-current="page"
                  to="/rezervacije"
                >
                  Rezervacije
                </NavLink>
              </li>
            ) : (
              ""
            )}
            {Object.keys(user).length === 0 ? (
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

            {Object.keys(user).length > 0 ? (
              <li className="nav-item dropdown">
                <p
                  className="nav-link text-link dropdown-toggle"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => setUserSubmenu(!userSubmenu)}
                >
                  {user.name}
                </p>
                <ul
                  className={`dropdown-menu ${userSubmenu ? "show" : ""}`}
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <p
                      className="dropdown-item text-link"
                      onClick={() => logout()}
                    >
                      Logout
                    </p>
                  </li>
                </ul>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar

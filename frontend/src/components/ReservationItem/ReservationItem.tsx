import React from "react"
import "reservation-item.css"

const Header = () => {
  return (
    <div className="row p-1">
      <div className="col-6 col-md-4">
        <div>
          <h4>Miki</h4>
          <h4>SingiBus</h4>
        </div>
      </div>
      <div className="col-6 col-md-4">Beograd - Čačak</div>
      <div className="col-6 d-md-none"></div>
      <div className="col-6 col-md-4">09:00 - 12:15</div>
    </div>
  )
}
const Body = () => {
  return (
    <div className="row p-1">
      <div className="col-6 col-md-4"></div>
      <div className="col-6 col-md-4"></div>
      <div className="col-12 col-md-4"></div>
    </div>
  )
}

export default { Body, Header }

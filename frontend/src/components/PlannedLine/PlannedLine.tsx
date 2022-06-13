import React from "react"
import "./planned-line.css"

interface HeaderProps {
  company: string
  seats: number
  startDestination: string
  endDestination: string
  startTime: string
  endTime: string
}

interface BodyProps {
  seats: number
  seatsTotal: number
  destinations: []
  price: string
  priceBack: string
  openModal: (params: any) => any
}

const Header = ({
  company,
  seats,
  startDestination,
  endDestination,
  startTime,
  endTime
}: HeaderProps) => {
  return (
    <div className="row col-12 p-1">
      <div className="col-6 col-md-4 d-flex flex-column justify-content-center">
        <h4 className="header-title">{company || ""}</h4>
        <p className="header-info mb-0">Broj slobodnih mesta: {seats}</p>
      </div>
      <div className="row col-6 col-md-8">
        <div className="col-12 col-md-8 d-flex justify-content-end justify-content-md-center align-items-center">
          <h4 className="header-title">Beograd - Čačak</h4>
        </div>
        <div className="col-12 col-md-4 d-flex justify-content-end align-items-center">
          09:00 - 12:15
        </div>
      </div>
    </div>
  )
}
const Body = ({
  seats,
  seatsTotal,
  destinations,
  price,
  priceBack,
  openModal
}: BodyProps) => {
  return (
    <div className="p-1">
      <div className="row">
        <div className="col-6 col-md-4">Broj slobodnih mesta</div>
        <div className="col-6 col-md-4">Beograd 09:00</div>
        <div className="col-6 col-md-4">
          <button
            type="button"
            onClick={() => {
              openModal(1)
            }}
          >
            - 1.200,00 RSD
          </button>
        </div>
      </div>
    </div>
  )
}

export default { Header, Body }

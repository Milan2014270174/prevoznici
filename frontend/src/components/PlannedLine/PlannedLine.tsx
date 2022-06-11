import React from "react"
import "./planned-line.css"

interface HeaderProps {
  company: string
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
  startDestination,
  endDestination,
  startTime,
  endTime
}: HeaderProps) => {
  return (
    <div className="row col-12 p-1">
      <div className="col-6 col-md-4">SingiBus</div>
      <div className="col-6 col-md-4">Beograd - Čačak</div>
      <div className="col-6 d-md-none"></div>
      <div className="col-6 col-md-4">09:00 - 12:15</div>
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

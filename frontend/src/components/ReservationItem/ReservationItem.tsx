import React, { useEffect, useState } from "react"
import Accordion from "../Accordion/Accordion"
import "./reservation-item.css"
import axiosClient from "../../axios/axiosClient"
import Loading from "../Loading/Loading"
import { User } from "../../reducers/authentication"
import { useAuthState } from "../../context/authentication"

interface ReservationItem {
  id: number
  company: string
  userName: string
  isPaid: boolean
  seats: number
  date: string
  type: string
  price: number
  startDestination: string
  endDestination: string
  startTime: string
  endTime: string
  openModal: (id: number) => any
}

const ReservationItem = ({
  id,
  company,
  seats,
  type,
  date,
  userName,
  isPaid,
  price,
  startDestination,
  endDestination,
  startTime,
  endTime,
  openModal
}: ReservationItem) => {
  const user: User | any = useAuthState().user

  return (
    <Accordion
      id={id}
      customClass={isPaid ? "selected" : ""}
      onCollapse={() => null}
      isCollapsed={false}
      header={
        <div className="row col-12 p-1">
          <div className="mb-3 mb-md-0 col-12 col-md-4 d-flex flex-column justify-content-center">
            <h4 className="header-title">{company || ""}</h4>
            <p className="header-info mb-0">Korisnik: {userName}</p>
          </div>
          <div className="row col-12 col-md-8">
            <div className="mb-3 mb-md-0 col-12 col-md-8 d-flex flex-column justify-content-start justify-content-md-center align-items-md-center">
              <h4 className="header-title">
                {startDestination} - {endDestination}
              </h4>
              <p className="header-info mb-0">
                {startTime.slice(0, -3)} - {endTime.slice(0, -3)}
              </p>
            </div>
            <div className="col-12 col-md-4 d-flex justify-content-start justify-content-md-end align-items-center">
              <h4 className="header-title">
                {new Date(date).toLocaleDateString("sr-RS")}
              </h4>
            </div>
          </div>
        </div>
      }
      body={
        <div className="p-1">
          <div className="row">
            <div className="col-12 col-md-6 d-flex flex-column justify-content-start align-items-start">
              <div className="col-12">
                <h4 className="planned-line-subtitle mb-3">
                  Broj rezervisanih karata:
                </h4>
                <p className={`info-text`}>{seats}</p>
              </div>
              <div className="col-12">
                <h4 className="planned-line-subtitle mb-3">Tip karte</h4>
                <p className={`info-text`}>{type}</p>
              </div>
            </div>
            <div className="row col-12 col-md-6 d-flex justify-content-md-end align-items-start">
              <div className="col-12 d-flex flex-column align-items-start align-items-md-end">
                <h4 className="planned-line-subtitle mb-2">
                  Cena {seats > 1 ? "karata" : "karte"}
                </h4>

                <p className={`info-text`}>{price * seats} RSD</p>
                {user.role_id === 1 ? (
                  !isPaid ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => openModal(id)}
                    >
                      Označi kao plaćeno
                    </button>
                  ) : (
                    <p className="info-text">Plaćeno!</p>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      }
    />
  )
}

export default ReservationItem

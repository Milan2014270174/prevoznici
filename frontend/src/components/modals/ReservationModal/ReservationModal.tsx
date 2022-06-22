import React, { useState, useEffect } from "react"
import axiosClient from "../../../axios/axiosClient"
import { useAuthState } from "../../../context/authentication"
import { User } from "../../../reducers/authentication"

interface ReservationModalProps {
  title: string
  ticket_type: string
  to_bus_line_station_id: number | null
  from_bus_line_station_id: number | null
  reserved_for_date_at: string
  seats_available: number | null
  price: number | null
  closeModal: () => any
  submitReservation: () => any
}

const initialState = {
  ticketNumber: 1,
  is_paid: false,
  error: false
}

const ReservationModal = ({
  title,
  ticket_type,
  to_bus_line_station_id,
  from_bus_line_station_id,
  reserved_for_date_at,
  seats_available,
  price,
  closeModal,
  submitReservation
}: ReservationModalProps) => {
  const [availableSeats, setAvailableSeats] = useState(seats_available)
  const [totalPrice, setTotal] = useState(seats_available)
  const [input, setInput] = useState(initialState)

  const user: User | any = useAuthState().user

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }
  function handleInputCheckbox(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.checked })
  }

  function handleSubmit() {
    if (
      input.ticketNumber > 0 &&
      seats_available &&
      input.ticketNumber < seats_available
    ) {
      axiosClient
        .post("/user/tickets/add", {
          ticket_type: ticket_type,
          to_bus_line_station_id: to_bus_line_station_id,
          from_bus_line_station_id: from_bus_line_station_id,
          number_of_tickets: input.ticketNumber
        })
        .then((res) => {
          console.log(res.data)
          submitReservation()
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  return (
    <div
      className="modal fade show"
      id="exampleModal"
      style={{ display: "block" }}
      aria-labelledby="exampleModalLabel"
      aria-hidden="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => closeModal()}
            ></button>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="mb-2 col-12">
                <label htmlFor="">Tip karte</label>
                <p className="info-text">{ticket_type}</p>
              </div>
              <div className="mb-2 col-12">
                <label htmlFor="">Broj slobodnih mesta:</label>
                <p className="info-text">{seats_available}</p>
              </div>
              <div className="mb-2 col-12">
                <label htmlFor="">Unesite broj karata</label>
                <input
                  id="ticketNumber"
                  name="ticketNumber"
                  value={input.ticketNumber}
                  onChange={handleInputChange}
                  type="number"
                  min={1}
                  max={seats_available || undefined}
                  className={`form-control ${
                    input.ticketNumber === 0 && input.error ? "is-invalid" : ""
                  }`}
                />
              </div>
              {Object.keys(user).length > 0 && user.role_id === 1 ? (
                <div className="mb-2 col-12">
                  <input
                    id="is_paid"
                    name="is_paid"
                    checked={input.is_paid}
                    onChange={handleInputCheckbox}
                    type="checkbox"
                    className={`form-check-input`}
                  />
                  <label htmlFor="is_paid" className="form-check-label">
                    Označi kao plaćeno
                  </label>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="modal-footer">
            <p className="info-text">
              Ukupno: {(price || 1) * (input.ticketNumber || 1)} RSD
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => closeModal()}
            >
              Otkaži
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Rezerviši
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationModal

import React, { useState, useEffect } from "react"
import axiosClient from "../../../axios/axiosClient"
import { useAuthState } from "../../../context/authentication"
import { defaultDate, EditLineModalType } from "../../../pages/Home/Home"
import { User } from "../../../reducers/authentication"

interface EditLineModalProps {
  title: string
  dataInput: EditLineModalType
  closeModal: () => any
  submitEdit: () => any
}

const EditLineModal = ({
  title,
  dataInput,
  closeModal,
  submitEdit
}: EditLineModalProps) => {
  const user: User | any = useAuthState().user

  const [input, setInput] = useState({ ...dataInput, error: false })

  const [companies, setCompanies] = useState([])
  const [cities, setCities] = useState([])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }
  function handleStartStationInput(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setInput({
      ...input,
      startStation: {
        ...input.startStation,
        city_id: event.target.value
      }
    })
  }
  function handleEndStationInput(event: React.ChangeEvent<HTMLSelectElement>) {
    setInput({
      ...input,
      endStation: {
        ...input.endStation,
        city_id: event.target.value
      }
    })
  }
  function handleStartDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({
      ...input,
      startStation: {
        ...input.startStation,
        arrives_at: event.target.value
      }
    })
  }
  function handleEndDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({
      ...input,
      endStation: {
        ...input.endStation,
        arrives_at: event.target.value
      }
    })
  }
  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  function handleSubmit() {
    if (
      input.seats_available > 0 &&
      input.price > 0 &&
      input.startStation.city_id &&
      input.reserved_for_date_at.length > 0 &&
      input.endStation.city_id &&
      input.startStation.arrives_at.length > 0 &&
      input.endStation.arrives_at.length > 0
    ) {
      console.log("submit")
      axiosClient
        .put("/admin/bus-lines/update", {
          line: {
            bus_line_id: input.id,
            bus_line_price: input.price,
            available_seats: input.seats_available,
            company_id: input.company_id
          },
          stations: [
            {
              bus_line_station_id: input.startStation.bus_line_station_id,
              arrives_at: input.startStation.arrives_at,
              bus_line_station_type: "POČETNO",
              city_id: input.startStation.city_id
            },
            {
              bus_line_station_id: input.endStation.bus_line_station_id,
              arrives_at: input.endStation.arrives_at,
              bus_line_station_type: "KRAJNJE",
              city_id: input.endStation.city_id
            }
          ]
        })
        .then((res) => {
          console.log(res.data)
          submitEdit()
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      setInput({ ...input, error: true })
    }
  }

  useEffect(() => {
    axiosClient.get("/companies/all").then((res) => {
      console.log("companies", res.data)
      setCompanies(res.data.companys)
    })
    axiosClient.get("/cities/all").then((res) => {
      console.log("companies", res.data)
      setCities(res.data.companys)
    })
  }, [])

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
              <div className="search-column mb-2 col-6">
                <label htmlFor="reserved_for_date_at">Datum polaska</label>
                <input
                  id="reserved_for_date_at"
                  name="reserved_for_date_at"
                  value={input.reserved_for_date_at}
                  onChange={handleDateChange}
                  min={defaultDate()}
                  type="date"
                  className={`form-control ${
                    input.reserved_for_date_at === "" && input.error
                      ? "is-invalid"
                      : ""
                  }`}
                />
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="seats_available">Broj slobodnih mesta</label>
                <input
                  id="seats_available"
                  name="seats_available"
                  value={input.seats_available}
                  onChange={handleInputChange}
                  type="number"
                  min={1}
                  className={`form-control ${
                    input.seats_available === 0 && input.error
                      ? "is-invalid"
                      : ""
                  }`}
                />
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="startDestination">Mesto polaska</label>
                <select
                  name="startDestination"
                  id="startDestination"
                  placeholder="Mesto polaska"
                  className={`select form-select ${
                    input.startStation.city_id === "" && input.error
                      ? "is-invalid"
                      : ""
                  }`}
                  value={input.startStation.city_id}
                  onChange={handleStartStationInput}
                >
                  <option value="">Izaberi mesto polaska</option>
                  {cities
                    ? cities.map((city: any) => {
                        return (
                          <option key={city.city_id} value={city.city_id}>
                            {city.city_name}
                          </option>
                        )
                      })
                    : ""}
                </select>
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="startTime">Vreme polaska</label>
                <input
                  id="startTime"
                  name="startTime"
                  value={input.startStation.arrives_at}
                  onChange={handleStartDateChange}
                  type="time"
                  className={`form-control ${
                    input.startStation.arrives_at === "" && input.error
                      ? "is-invalid"
                      : ""
                  }`}
                />
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="endDestination">Odredište</label>
                <select
                  name="endDestination"
                  id="endDestination"
                  className={`select form-select ${
                    input.endStation.city_id === "" && input.error
                      ? "is-invalid"
                      : ""
                  }`}
                  value={input.endStation.city_id}
                  onChange={handleEndStationInput}
                >
                  <option value="">Izaberi odredište</option>
                  {cities
                    ? cities.map((city: any) => {
                        return (
                          <option key={city.city_id} value={city.city_id}>
                            {city.city_name}
                          </option>
                        )
                      })
                    : ""}
                </select>
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="endTime">Vreme dolaska</label>
                <input
                  id="endTime"
                  name="endTime"
                  value={input.endStation.arrives_at}
                  onChange={handleEndDateChange}
                  type="time"
                  className={`form-control ${
                    input.endStation.arrives_at === "" && input.error
                      ? "is-invalid"
                      : ""
                  }`}
                />
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="price">Cena karte u dinarima</label>
                <input
                  id="price"
                  name="price"
                  value={input.price}
                  onChange={handleInputChange}
                  type="number"
                  min={0}
                  step={100}
                  className={`form-control ${
                    input.price > 0 && input.error ? "is-invalid" : ""
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
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
              Uredi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditLineModal

import React, { useState, useEffect } from "react"
import axiosClient from "../../../axios/axiosClient"
import { defaultDate, EditLineModalType } from "../../../pages/Home/Home"

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
  const [input, setInput] = useState({ ...dataInput, error: false })
  const [cities, setCities] = useState([])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }
  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  function handleStationsInputChange(
    id: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setInput({
      ...input,
      stations: input.stations.map((station) => {
        if (station.bus_line_station_id === id) {
          return {
            ...station,
            city_id: event.target.value
          }
        } else {
          return station
        }
      })
    })
  }
  function handleStationsDateChange(
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setInput({
      ...input,
      stations: input.stations.map((station) => {
        if (station.bus_line_station_id === id) {
          return {
            ...station,
            arrives_at: event.target.value
          }
        } else {
          return station
        }
      })
    })
  }

  function handleSubmit() {
    let fault = false
    for (let i = 0; i < input.stations.length; i++) {
      if (input.stations[i].arrives_at === "" || !input.stations[i].city_id) {
        fault = true
        break
      }
    }
    if (
      input.seats_available > 0 &&
      input.price > 0 &&
      !fault &&
      input.reserved_for_date_at.length > 0
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
          stations: input.stations
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
              {input.stations.map((station, i) => {
                if (i === 0) {
                  return (
                    <>
                      <div className="search-column mb-2 col-6">
                        <label htmlFor="startDestination">Mesto polaska</label>
                        <select
                          name="startDestination"
                          id="startDestination"
                          placeholder="Mesto polaska"
                          className={`select form-select ${
                            !station.city_id && input.error ? "is-invalid" : ""
                          }`}
                          value={station.city_id}
                          onChange={(e) =>
                            handleStationsInputChange(
                              station.bus_line_station_id,
                              e
                            )
                          }
                        >
                          <option value="">Izaberi mesto polaska</option>
                          {cities
                            ? cities.map((city: any) => {
                                return (
                                  <option
                                    key={city.city_id}
                                    value={city.city_id}
                                  >
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
                          value={station.arrives_at}
                          onChange={(e) =>
                            handleStationsDateChange(
                              station.bus_line_station_id,
                              e
                            )
                          }
                          type="time"
                          className={`form-control ${
                            station.arrives_at === "" && input.error
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                    </>
                  )
                } else if (i === input.stations.length - 1) {
                  return (
                    <>
                      <div className="search-column mb-2 col-6">
                        <label htmlFor="endDestination">Odredište</label>
                        <select
                          name="endDestination"
                          id="endDestination"
                          className={`select form-select ${
                            !station.city_id && input.error ? "is-invalid" : ""
                          }`}
                          value={station.city_id}
                          onChange={(e) =>
                            handleStationsInputChange(
                              station.bus_line_station_id,
                              e
                            )
                          }
                        >
                          <option value="">Izaberi odredište</option>
                          {cities
                            ? cities.map((city: any) => {
                                return (
                                  <option
                                    key={city.city_id}
                                    value={city.city_id}
                                  >
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
                          value={station.arrives_at}
                          onChange={(e) =>
                            handleStationsDateChange(
                              station.bus_line_station_id,
                              e
                            )
                          }
                          type="time"
                          className={`form-control ${
                            station.arrives_at === "" && input.error
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                    </>
                  )
                } else {
                  return (
                    <>
                      <div className="search-column mb-2 col-6">
                        <label htmlFor={`station${i}`}>
                          Stajalište {i + 1}
                        </label>
                        <select
                          name={`station${i}`}
                          id={`station${i}`}
                          className={`select form-select ${
                            station.city_id === null && input.error
                              ? "is-invalid"
                              : ""
                          }`}
                          value={station.city_id}
                          onChange={(e) =>
                            handleStationsInputChange(
                              station.bus_line_station_id,
                              e
                            )
                          }
                        >
                          <option value="">Izaberi odredište</option>
                          {cities
                            ? cities.map((city: any) => {
                                return (
                                  <option
                                    key={city.city_id}
                                    value={city.city_id}
                                  >
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
                          value={station.arrives_at}
                          onChange={(e) =>
                            handleStationsDateChange(
                              station.bus_line_station_id,
                              e
                            )
                          }
                          type="time"
                          className={`form-control ${
                            station.arrives_at === "" && input.error
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      </div>
                    </>
                  )
                }
              })}
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

import React, { useEffect, useState } from "react"
import axiosClient from "../../../axios/axiosClient"
import { defaultDate } from "../../../pages/Home/Home"

const today = new Date()

interface NewLineModalProps {
  title: string
  closeModal: () => any
  addNewLine: (params: any, date: string) => any
}

function newStation() {
  return {
    id: Math.random().toString(36).slice(2, 7),
    city_id: "",
    arrives_at: ""
  }
}

const initialState = {
  prevoznik: "",
  bus_line_price: 0,
  available_seats: 0,
  bus_register_number: "",
  date: defaultDate(),
  startStation: {
    city_id: "",
    arrives_at: ""
  },
  endStation: {
    city_id: "",
    arrives_at: ""
  },
  stations: [newStation()],
  error: false
}

const NewLineModal = ({ title, closeModal, addNewLine }: NewLineModalProps) => {
  const [input, setInput] = useState(initialState)
  const [error, setError] = useState(false)

  const [companies, setCompanies] = useState([])
  const [cities, setCities] = useState([])

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }
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
  function handleStationsInputChange(
    id: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setInput({
      ...input,
      stations: input.stations.map((station) => {
        if (station.id === id) {
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
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setInput({
      ...input,
      stations: input.stations.map((station) => {
        if (station.id === id) {
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

  function addNewStation() {
    setInput({ ...input, stations: [...input.stations, newStation()] })
  }
  function removeStation(id: string) {
    setInput({ ...input, stations: input.stations.filter((s) => s.id !== id) })
  }

  function submitModal() {
    if (
      input.prevoznik.length > 0 &&
      input.available_seats > 0 &&
      input.bus_line_price > 0 &&
      input.startStation.city_id.length > 0 &&
      input.date.length > 0 &&
      input.endStation.city_id.length > 0 &&
      input.startStation.arrives_at.length > 0 &&
      input.endStation.arrives_at.length > 0
    ) {
      console.log("submit")
      let stations = input.stations.map((station) => {
        return {
          arrives_at: station.arrives_at,
          bus_line_station_type: "IZMEĐU",
          city_id: station.city_id
        }
      })
      stations = [
        {
          arrives_at: input.startStation.arrives_at,
          bus_line_station_type: "POČETNO",
          city_id: input.startStation.city_id
        },
        ...stations,
        {
          arrives_at: input.endStation.arrives_at,
          bus_line_station_type: "KRAJNJE",
          city_id: input.endStation.city_id
        }
      ]
      axiosClient
        .post("/admin/bus-lines/add", {
          line: {
            bus_line_price: input.bus_line_price,
            driver_hash: Math.random().toString(36).slice(2, 7),
            available_seats: input.available_seats,
            bus_register_number: Math.random().toString(36).slice(2, 7),
            company_id: input.prevoznik,
            reserved_date_at: input.date
          },
          stations: stations
        })
        .then((res) => {
          console.log(res.data)
          addNewLine(res.data.busLine, input.date)
        })
        .catch((err) => {
          console.log("submit error", err)
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
                <label htmlFor="prevoznik">Prevoznik</label>
                <select
                  id="prevoznik"
                  name="prevoznik"
                  value={input.prevoznik}
                  onChange={(e) => handleSelectChange(e)}
                  className={`select form-select ${
                    input.prevoznik === "" && input.error ? "is-invalid" : ""
                  }`}
                  placeholder="Prevoznici"
                >
                  <option value="">Izaberi prevoznika</option>
                  {companies
                    ? companies.map((company: any) => {
                        return (
                          <option
                            key={company.company_id}
                            value={company.company_id}
                          >
                            {company.company_name}
                          </option>
                        )
                      })
                    : ""}
                </select>
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="date">Datum polaska</label>
                <input
                  id="date"
                  name="date"
                  value={input.date}
                  onChange={handleDateChange}
                  min={defaultDate()}
                  type="date"
                  className={`form-control ${
                    input.date === "" && input.error ? "is-invalid" : ""
                  }`}
                />
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="available_seats">Broj slobodnih mesta</label>
                <input
                  id="available_seats"
                  name="available_seats"
                  value={input.available_seats}
                  onChange={handleInputChange}
                  type="number"
                  min={1}
                  className={`form-control ${
                    input.available_seats === 0 && input.error
                      ? "is-invalid"
                      : ""
                  }`}
                />
              </div>
              <div className="search-column mb-2 col-6"></div>
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
              {input.stations.length > 0
                ? input.stations.map((station: {} | any, i) => {
                    return (
                      <div key={i} className="row col-12">
                        <div className="search-column mb-2 col-6">
                          <label htmlFor={`station${i}`}>
                            Stajalište {i + 1}
                          </label>
                          <select
                            name={`station${i}`}
                            id={`station${i}`}
                            placeholder="Mesto polaska"
                            className={`select form-select ${
                              station.city_id === "" && input.error
                                ? "is-invalid"
                                : ""
                            }`}
                            value={station.city_id}
                            onChange={(e) =>
                              handleStationsInputChange(station.id, e)
                            }
                          >
                            <option value="">Izaberite stajalište {i}</option>
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
                        <div className="search-column mb-2 col-5">
                          <label htmlFor={`time${i}`}>Vreme polaska</label>
                          <input
                            id={`time${i}`}
                            name={`time${i}`}
                            value={station.arrives_at}
                            onChange={(e) =>
                              handleStationsDateChange(station.id, e)
                            }
                            type="time"
                            className={`form-control ${
                              station.arrives_at === "" && input.error
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                        </div>
                        <div className="d-flex align-items-end col-1">
                          <p
                            className="text-link text-danger"
                            onClick={() => removeStation(station.id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </p>
                        </div>
                      </div>
                    )
                  })
                : ""}
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
            </div>
            <p
              className="text-link text-primary"
              onClick={() => addNewStation()}
            >
              <i className="fa-solid fa-plus"></i> Dodaj stajalište
            </p>
            <div className="search-column mb-2 col-6">
              <label htmlFor="bus_line_price">Cena karte u dinarima</label>
              <input
                id="bus_line_price"
                name="bus_line_price"
                value={input.bus_line_price}
                onChange={handleInputChange}
                type="number"
                min={0}
                step={100}
                className={`form-control ${
                  input.bus_line_price > 0 && input.error ? "is-invalid" : ""
                }`}
              />
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
              onClick={() => submitModal()}
            >
              Potvrdi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewLineModal

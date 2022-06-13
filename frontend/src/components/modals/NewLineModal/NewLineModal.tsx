import React, { useEffect, useState } from "react"
import axiosClient from "../../../axios/axiosClient"

const today = new Date()

function todaysDate() {
  var date = today.getDate()
  var month = today.getMonth() + 1
  return (
    today.getFullYear() +
    "-" +
    `${month < 10 ? `0${month}` : month}` +
    "-" +
    `${date < 10 ? `0${date}` : date}`
  )
}

interface NewLineModalProps {
  title: string
  closeModal: () => any
}

const newStation = {
  id: Math.random().toString(36).slice(2, 7),
  destination: "",
  time: ""
}

const initialState = {
  prevoznik: "",
  date: todaysDate(),
  startStation: {
    destination: "",
    time: ""
  },
  endStation: {
    destination: "",
    time: ""
  },
  stations: [newStation]
}

const NewLineModal = ({ title, closeModal }: NewLineModalProps) => {
  const [input, setInput] = useState(initialState)

  const [companies, setCompanies] = useState([])

  function handleInputChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }
  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  function addNewStation() {
    setInput({ ...input, stations: [...input.stations, newStation] })
  }
  function removeStation(id: string) {
    setInput({ ...input, stations: input.stations.filter((s) => s.id !== id) })
  }

  useEffect(() => {
    axiosClient.get("/companies/all").then((res) => {
      console.log("companies", res.data)
      setCompanies(res.data.companys)
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
                <label htmlFor="companies">Prevoznik</label>
                <select
                  id="companies"
                  name="companies"
                  value={input.prevoznik}
                  onChange={handleInputChange}
                  className="select form-select"
                  placeholder="Prevoznici"
                >
                  <option value="">Izaberi prevoznika</option>
                  {companies
                    ? companies.map((company: any) => {
                        return (
                          <option
                            key={company.company_id}
                            value={company.company_name}
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
                  type="date"
                  className="form-control"
                />
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="startDestination">Mesto polaska</label>
                <select
                  name="startDestination"
                  id="startDestination"
                  placeholder="Mesto polaska"
                  className="select form-select"
                  value={input.startStation.destination}
                  onChange={handleInputChange}
                >
                  <option value="">Izaberi mesto polaska</option>
                  <option>Beograd</option>
                  <option>Niš</option>
                  <option>Novi Sad</option>
                </select>
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="startTime">Vreme polaska</label>
                <input
                  id="startTime"
                  name="startTime"
                  value={input.startStation.time}
                  onChange={handleDateChange}
                  type="time"
                  className="form-control"
                />
              </div>
              {input.stations.length > 0
                ? input.stations.map((station: {} | any, i) => {
                    return (
                      <div key={i} className="row col-12">
                        <div className="search-column mb-2 col-6">
                          <label htmlFor={`station${i}`}>Stajalište {i}</label>
                          <select
                            name={`station${i}`}
                            id={`station${i}`}
                            placeholder="Mesto polaska"
                            className="select form-select"
                            value={station.destination}
                            onChange={handleInputChange}
                          >
                            <option value="">Izaberite stajalište {i}</option>
                            <option>Beograd</option>
                            <option>Niš</option>
                            <option>Novi Sad</option>
                          </select>
                        </div>
                        <div className="search-column mb-2 col-5">
                          <label htmlFor={`time${i}`}>Vreme polaska</label>
                          <input
                            id={`time${i}`}
                            name={`time${i}`}
                            value={station.time}
                            onChange={handleDateChange}
                            type="time"
                            className="form-control"
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
                  className="select form-select"
                  value={input.endStation.destination}
                  onChange={handleInputChange}
                >
                  <option value="">Izaberi odredište</option>

                  <option>Beograd</option>
                  <option>Niš</option>
                  <option>Novi Sad</option>
                </select>
              </div>
              <div className="search-column mb-2 col-6">
                <label htmlFor="endTime">Vreme dolaska</label>
                <input
                  id="endTime"
                  name="endTime"
                  value={input.endStation.time}
                  onChange={handleDateChange}
                  type="time"
                  className="form-control"
                />
              </div>
            </div>
            <p
              className="text-link text-primary"
              onClick={() => addNewStation()}
            >
              <i className="fa-solid fa-plus"></i> Dodaj stajalište
            </p>
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

            <button type="button" className="btn btn-primary">
              Potvrdi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewLineModal

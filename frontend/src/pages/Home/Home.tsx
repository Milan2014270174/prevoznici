import { useState, useEffect } from "react"
import "./home.css"
import PlannedLine from "../../components/PlannedLine/PlannedLine"
import axiosClient from "../../axios/axiosClient"
import Modal from "../../components/modals/Modal/Modal"
import { useAuthState } from "../../context/authentication"
import { User } from "../../reducers/authentication"
import { Link } from "react-router-dom"
import ReservationModal from "../../components/modals/ReservationModal/ReservationModal"
import NewLineModal from "../../components/modals/NewLineModal/NewLineModal"

const today = new Date()

export type DestinationType = {
  arrives_at: string
  bus_line_station_id: number
  city_id: number
  city_name: string
}

type PlannedLineType = {
  bus_line_id: number
  company_name: string
  available_seats: number
  POČETNO: DestinationType | any
  KRAJNJE: DestinationType | any
}

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

const Home = () => {
  const [input, setInput] = useState({
    companies: "",
    startDestination: "",
    endDestination: "",
    date: todaysDate()
  })

  const user: User | any = useAuthState().user

  const [plannedLines, setPlannedLines] = useState<PlannedLineType[]>([])

  const [companies, setCompanies] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)

  // Modali
  const [reservationModal, setReservationModal] = useState(false)
  const [authModal, setAuthModal] = useState(false)
  const [newLineModal, setNewLineModal] = useState(false)

  function handleInputChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }
  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  function openReservationModal(id: number) {
    console.log("make reservation", id)
    setReservationModal(true)
  }
  function closeReservationModal() {
    setReservationModal(false)
  }
  function closeAuthModal() {
    setAuthModal(false)
  }

  useEffect(() => {
    console.log("input", input)
  }, [input])

  useEffect(() => {
    // not iterable
    axiosClient
      .get("/bus-lines/all")
      .then((res) => {
        console.log("bus lines", res.data)
        setPlannedLines(res.data.busLines)
      })
      .catch((err) => {
        console.log(err)
      })

    axiosClient.get("/companies/all").then((res) => {
      console.log("companies", res.data)
      setCompanies(res.data.companys)
    })
    axiosClient.get("/cities/all").then((res) => {
      console.log("cities", res.data)
      setCities(res.data.companys)
    })
  }, [])

  return (
    <div className="home-page">
      <div
        className="hero d-flex justify-content-start align-items-center"
        style={{ backgroundImage: `url('images/hero.png')` }}
      >
        <h1 className="title">Online prodaja karata</h1>
      </div>
      <div className="container py-5">
        <div className="search-wrapper">
          <div className="row col-12">
            <div className="search-column mb-2 col-12 col-sm-6 col-md-3">
              <label htmlFor="companies">Pretraga</label>
              <select
                id="companies"
                name="companies"
                value={input.companies}
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
            <div className="search-column mb-2 col-12 col-sm-6 col-md-3">
              <label htmlFor="startDestination">Mesto polaska</label>
              <select
                name="startDestination"
                id="startDestination"
                placeholder="Mesto polaska"
                className="select form-select"
                value={input.startDestination}
                onChange={handleInputChange}
              >
                <option value="">Izaberi mesto polaska</option>
                {cities
                  ? cities.map((city: any) => {
                      return (
                        <option key={city.city_id} value={city.city_name}>
                          {city.city_name}
                        </option>
                      )
                    })
                  : ""}
              </select>
            </div>
            <div className="search-column mb-2 col-12 col-sm-6 col-md-3">
              <label htmlFor="endDestination">Mesto dolaska</label>
              <select
                name="endDestination"
                id="endDestination"
                className="select form-select"
                value={input.endDestination}
                onChange={handleInputChange}
              >
                <option value="">Izaberi mesto dolaska</option>
                {cities
                  ? cities.map((city: any) => {
                      return (
                        <option key={city.city_id} value={city.city_name}>
                          {city.city_name}
                        </option>
                      )
                    })
                  : ""}
              </select>
            </div>
            <div className="search-column mb-2 col-12 col-sm-6 col-md-3">
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
          </div>
        </div>
        <h3 className="subtitle my-5">{input.date}</h3>
        <div className="item-list my-5">
          {plannedLines.map((plannedLine: PlannedLineType, i) => {
            return (
              <PlannedLine
                key={i}
                id={plannedLine.bus_line_id}
                company={plannedLine.company_name}
                seats={plannedLine.available_seats}
                seatsTotal={0}
                startDestination={
                  plannedLine.POČETNO ? plannedLine.POČETNO.city_name : ""
                }
                endDestination={
                  plannedLine.KRAJNJE ? plannedLine.KRAJNJE.city_name : ""
                }
                startTime={
                  plannedLine.POČETNO ? plannedLine.POČETNO.arrives_at : ""
                }
                endTime={
                  plannedLine.KRAJNJE ? plannedLine.KRAJNJE.arrives_at : ""
                }
                openModal={openReservationModal}
              />
            )
          })}
        </div>
      </div>
      {reservationModal ? (
        Object.keys(user).length > 0 ? (
          <ReservationModal
            title={"Rezervisi kartu"}
            closeModal={closeReservationModal}
          />
        ) : (
          <Modal
            title={"Rezervisi kartu"}
            body={
              <>
                <div className="mb-3 d-flex flex-column align-items-center">
                  <h4 className="mb-2 text-center">
                    Morate se ulogovati da biste rezervisali kartu.
                  </h4>

                  <Link to="/login">
                    <button type="button" className="btn btn-primary">
                      Login
                    </button>
                  </Link>
                </div>
                <div className="mb-3 d-flex flex-column align-items-center">
                  <h4 className="mb-2 text-center">
                    Ili se registrujte ukoliko nemate nalog
                  </h4>

                  <Link to="/registracija">
                    <button type="button" className="btn btn-primary">
                      Registracija
                    </button>
                  </Link>
                </div>
              </>
            }
            closeModal={closeReservationModal}
          />
        )
      ) : (
        ""
      )}
      {Object.keys(user).length > 0 && user.role_id === 1 ? (
        <>
          <div
            className="add-new-button btn-primary"
            onClick={() => setNewLineModal(true)}
          >
            <i className="fa-solid fa-plus"></i>
          </div>
          {newLineModal ? (
            <NewLineModal
              title={"Dodaj planiranu liniju"}
              closeModal={() => setNewLineModal(false)}
            ></NewLineModal>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  )
}

export default Home

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

export type DestinationType = {
  arrives_at: string
  bus_line_station_id: number
  city_id: number
  city_name: string
}
export type ReservationModalType = {
  show: boolean
  ticket_type: string
  to_bus_line_station_id: number | null
  from_bus_line_station_id: number | null
  reserved_for_date_at: string
  seats_available: number | null
  price: number | null
}

type PlannedLineType = {
  bus_line_id: number
  company_name: string
  company_id: string
  available_seats: number
  POČETNO: DestinationType | any
  KRAJNJE: DestinationType | any
}

function sortArray(array: PlannedLineType[]) {
  return array.reverse()
}

export function defaultDate() {
  const today = new Date()

  var date = today.getDate() + 1
  var month = today.getMonth() + 1
  return (
    today.getFullYear() +
    "-" +
    `${month < 10 ? `0${month}` : month}` +
    "-" +
    `${date < 10 ? `0${date}` : date}`
  )
}

const initReservationModal = {
  show: false,
  ticket_type: "",
  to_bus_line_station_id: null,
  from_bus_line_station_id: null,
  reserved_for_date_at: "",
  seats_available: null,
  price: null
}

const Home = () => {
  const [input, setInput] = useState({
    prevoznik: "",
    startDestination: "",
    endDestination: "",
    date: defaultDate()
  })

  const user: User | any = useAuthState().user

  const [plannedLines, setPlannedLines] = useState<PlannedLineType[]>([])

  const [companies, setCompanies] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)

  const [successMessage, setSuccessMessage] = useState("")
  const [successReservationModal, setSuccessReservationModal] = useState(false)

  // Modali
  const [reservationModal, setReservationModal] =
    useState<ReservationModalType>(initReservationModal)
  const [authModal, setAuthModal] = useState(false)
  const [newLineModal, setNewLineModal] = useState(false)

  function addNewLine(plannedLine: PlannedLineType, date: string) {
    setInput({
      ...input,
      prevoznik: plannedLine.company_id,
      startDestination: plannedLine.POČETNO.city_id,
      endDestination: plannedLine.KRAJNJE.city_id,
      date: date
    })
    // setPlannedLines([plannedLine, ...plannedLines])
    setNewLineModal(false)
    setSuccessMessage("Uspešno ste dodali novu liniju.")
  }

  function submitReservation() {
    setReservationModal(initReservationModal)
    setSuccessReservationModal(true)
  }

  function handleInputChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }
  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  function openReservationModal(
    ticket_type: string,
    to_bus_line_station_id: number | null,
    from_bus_line_station_id: number | null,
    reserved_for_date_at: string,
    seats_available: number | null,
    price: number | null
  ) {
    // console.log("make reservation", id)
    setReservationModal({
      show: true,
      ticket_type: ticket_type,
      to_bus_line_station_id: to_bus_line_station_id,
      from_bus_line_station_id: from_bus_line_station_id,
      reserved_for_date_at: reserved_for_date_at,
      seats_available: seats_available,
      price: price
    })
  }
  function closeReservationModal() {
    setReservationModal(initReservationModal)
  }
  function closeAuthModal() {
    setAuthModal(false)
  }

  useEffect(() => {
    // /bus-lines/all?cityFrom=19&cityTo=26&date=2022-06-16
    if (input.date && input.startDestination && input.endDestination) {
      axiosClient
        .get(
          `/bus-lines/all?date=${input.date}${
            input.startDestination ? `&cityFrom=${input.startDestination}` : ""
          }${input.endDestination ? `&cityTo=${input.endDestination}` : ""}${
            input.prevoznik ? `&prevoznik=${input.prevoznik}` : ""
          }`
        )
        .then((res) => {
          console.log("bus lines", res.data)
          setPlannedLines(sortArray(res.data.busLines))
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      setPlannedLines([])
    }
  }, [input])

  useEffect(() => {
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
              <label htmlFor="prevoznik">Pretraga</label>
              <select
                id="prevoznik"
                name="prevoznik"
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
                          value={company.company_id}
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
                        <option key={city.city_id} value={city.city_id}>
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
                        <option key={city.city_id} value={city.city_id}>
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
                min={defaultDate()}
                className="form-control"
              />
            </div>
          </div>
        </div>
        {input.date && input.startDestination && input.endDestination ? (
          <h3 className="page-title my-5">
            Rezultati pretrage za datum: <br />{" "}
            {new Date(input.date).toLocaleDateString("sr-RS")}
          </h3>
        ) : (
          <h3 className="page-title my-5">
            Morate izabrati datum, mesto polaska i dolaska
          </h3>
        )}

        {successMessage.length > 0 ? (
          <p className="info-text">{successMessage}</p>
        ) : (
          ""
        )}
        <div className="item-list my-5">
          {input.date &&
          input.startDestination &&
          input.endDestination &&
          plannedLines.length === 0 ? (
            <p className="help-text">
              Nema rezultata pretrage za izabrane filtere
            </p>
          ) : (
            plannedLines.map((plannedLine: PlannedLineType, i) => {
              return (
                <PlannedLine
                  key={plannedLine.bus_line_id}
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
                  date={input.date}
                  openModal={openReservationModal}
                />
              )
            })
          )}
        </div>
      </div>
      {successReservationModal ? (
        <Modal
          title="Hvala!"
          body={<p className="info-text">Uspešno ste rezervisali kartu.</p>}
          closeModal={() => setSuccessReservationModal(false)}
        ></Modal>
      ) : (
        ""
      )}
      {reservationModal.show ? (
        Object.keys(user).length > 0 ? (
          <ReservationModal
            title={"Rezervisi kartu"}
            ticket_type={reservationModal.ticket_type}
            to_bus_line_station_id={reservationModal.to_bus_line_station_id}
            from_bus_line_station_id={reservationModal.from_bus_line_station_id}
            reserved_for_date_at={reservationModal.reserved_for_date_at}
            seats_available={reservationModal.seats_available}
            price={reservationModal.price}
            closeModal={closeReservationModal}
            submitReservation={submitReservation}
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
              addNewLine={addNewLine}
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

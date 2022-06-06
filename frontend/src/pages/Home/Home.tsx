import { useState, useEffect } from "react"
import "./home.css"
import Accordion from "../../components/Accordion/Accordion"
import PlannedLines from "../../components/PlannedLines/PlannedLines"
import axiosClient from "../../axios/axiosClient"
import Modal from "../../components/Modal/Modal"

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

const initReservationModal = {
  show: false,
  id: ""
}

const Home = () => {
  const [input, setInput] = useState({
    companies: "",
    startDestination: "",
    endDestination: "",
    date: todaysDate()
  })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [reservationModal, setReservationModal] = useState({
    show: false,
    id: ""
  })
  const [newLineModal, setNewLineModal] = useState(false)

  function handleInputChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }
  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  function openReservationModal(id: string) {
    console.log(id)
    setReservationModal({
      show: true,
      id: id
    })
  }
  function closeReservationModal() {
    setReservationModal(initReservationModal)
  }
  function submitReservationModal() {
    console.log("submit")
  }

  useEffect(() => {
    console.log("search")
  }, [input])

  return (
    <div className="home-page">
      <div
        className="hero d-flex justify-content-start align-items-center"
        style={{ backgroundImage: `url('images/hero.png')` }}
      >
        <h1 className="title">Dobrodošli na online prodaju karata</h1>
      </div>
      <div className="container py-5">
        <div className="search-wrapper">
          <div className="row col-12">
            <div className="col col-6 col-md-3">
              <label htmlFor="companies">Pretraga</label>
              <select
                id="companies"
                name="companies"
                value={input.companies}
                onChange={handleInputChange}
                className="select"
                placeholder="Prevoznici"
              >
                <option>-</option>
                <option>SingiBus</option>
                <option>BlablaBus</option>
              </select>
            </div>
            <div className="col col-6 col-md-3">
              <label htmlFor="startDestination">Mesto polaska</label>
              <select
                name="startDestination"
                id="startDestination"
                placeholder="Mesto polaska"
                value={input.startDestination}
                onChange={handleInputChange}
              >
                <option>-</option>
                <option>Beograd</option>
                <option>Niš</option>
                <option>Novi Sad</option>
              </select>
            </div>
            <div className="col col-6 col-md-3">
              <label htmlFor="endDestination">Mesto dolaska</label>
              <select
                name="endDestination"
                id="endDestination"
                value={input.endDestination}
                onChange={handleInputChange}
              >
                <option>-</option>
                <option>Beograd</option>
                <option>Niš</option>
                <option>Novi Sad</option>
              </select>
            </div>
            <div className="col col-6 col-md-3">
              <label htmlFor="date">Datum polaska</label>
              <input
                id="date"
                name="date"
                value={input.date}
                onChange={handleDateChange}
                type="date"
                className="date"
              />
            </div>
          </div>
        </div>
        <h3 className="subtitle my-5">{input.date}</h3>
        <div className="item-list my-5">
          <Accordion
            header={
              <PlannedLines.Header
                company=""
                startDestination=""
                endDestination=""
                startTime=""
                endTime=""
              />
            }
            body={
              <PlannedLines.Body
                seats={0}
                seatsTotal={0}
                destinations={[]}
                price=""
                priceBack=""
                openModal={openReservationModal}
              />
            }
          />
          <Accordion
            header={
              <PlannedLines.Header
                company=""
                startDestination=""
                endDestination=""
                startTime=""
                endTime=""
              />
            }
            body={
              <PlannedLines.Body
                seats={0}
                seatsTotal={0}
                destinations={[]}
                price=""
                priceBack=""
                openModal={openReservationModal}
              />
            }
          />
        </div>
      </div>
      {reservationModal.show ? (
        <Modal
          modal={reservationModal}
          closeModal={closeReservationModal}
          submitModal={submitReservationModal}
        />
      ) : (
        ""
      )}
    </div>
  )
}

export default Home

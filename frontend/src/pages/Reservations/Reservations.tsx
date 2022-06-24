import React, { useEffect, useState } from "react"
import axiosClient from "../../axios/axiosClient"
import Loading from "../../components/Loading/Loading"
import PaidModal from "../../components/modals/PaidModal/PaidModal"
import ReservationItem from "../../components/ReservationItem/ReservationItem"
import { useAuthState } from "../../context/authentication"
import { User } from "../../reducers/authentication"
import { StationType } from "../Home/Home"

type TicketType = {
  ticket_id: number
  ticket_price: number
  ticket_type: string
  name: string
  company_name: string
  reserved_date_at: string
  seats: number
  is_paid: boolean
  user_id: number
  to_bus_line_station_id: number
  from_bus_line_station_id: number
  roundtrip_expires_at: string
  number_of_tickets: number
  toStation: StationType
  fromStation: StationType
}

const Reservations = () => {
  const user: User | any = useAuthState().user
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const [paidModalState, setPaidModalState] = useState<{
    show: boolean
    id: number | null
  }>({
    show: false,
    id: null
  })

  function submitPaidModal(id: number) {
    console.log("paid id", id)
    axiosClient
      .put("/admin/tickets/update", {
        ticket_id: id,
        ticket: {
          is_paid: 1
        }
      })
      .then((res) => {
        console.log(res.data)
        setSuccessMessage(res.data.message)
      })
      .catch((err) => {
        console.log(err)
      })
    setPaidModalState({ show: false, id: null })
  }

  function openPaidModal(id: number) {
    setPaidModalState({ id: id, show: true })
  }

  function getTickets() {
    setLoading(true)
    axiosClient
      .get("/admin/tickets/all")
      .then((res) => {
        console.log(res.data)
        setTickets(res.data.tickets)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (successMessage.length > 0) {
      getTickets()
      setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
    }
  }, [successMessage])

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      if (user.role_id === 1) {
        getTickets()
      } else {
        axiosClient
          .get("/user/tickets/my")
          .then((res) => {
            console.log(res.data)
            setTickets(res.data.tickets)
            setLoading(false)
          })
          .catch((err) => {
            console.log(err)
            setLoading(false)
          })
      }
    }
  }, [])
  return (
    <div className="container py-5">
      <h1 className="mb-3 page-title">Rezervacije</h1>
      {successMessage.length > 0 ? (
        <p className="info-text">{successMessage}</p>
      ) : (
        ""
      )}
      <div className="item-list my-5">
        {loading ? (
          <Loading />
        ) : (
          tickets.map((ticket, i) => {
            return (
              <ReservationItem
                key={ticket.ticket_id}
                id={ticket.ticket_id}
                date={ticket.reserved_date_at}
                company={ticket.company_name}
                userName={ticket.name}
                type={ticket.ticket_type}
                isPaid={ticket.is_paid}
                price={ticket.ticket_price}
                seats={ticket.number_of_tickets}
                startDestination={ticket.fromStation.city_name}
                startTime={ticket.fromStation.arrives_at}
                endDestination={ticket.toStation.city_name}
                endTime={ticket.toStation.arrives_at}
                openModal={openPaidModal}
              />
            )
          })
        )}
      </div>
      {paidModalState.show && paidModalState.id !== null ? (
        <PaidModal
          title="Validacija"
          id={paidModalState.id}
          submitModal={submitPaidModal}
          closeModal={() => setPaidModalState({ id: null, show: false })}
        />
      ) : (
        ""
      )}
    </div>
  )
}

export default Reservations

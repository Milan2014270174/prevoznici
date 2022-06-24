import React, { useEffect, useState } from "react"
import Accordion from "../Accordion/Accordion"
import "./planned-line.css"
import axiosClient from "../../axios/axiosClient"
import Loading from "../Loading/Loading"
import { User } from "../../reducers/authentication"
import { useAuthState } from "../../context/authentication"

interface PlannedLine {
  id: number
  company: string
  seats: number
  seatsTotal: number
  startDestination: string
  endDestination: string
  startTime: string
  endTime: string
  date: string

  openModal: (
    ticket_type: string,
    from_bus_line_station_id: number | null,
    to_bus_line_station_id: number | null,
    reserved_for_date_at: string,
    seats_available: number,
    price: number
  ) => any
  openEditLineModal: (id: number, price: number) => any
}

type Station = {
  arrives_at: string
  bus_line_id: number
  bus_line_station_id: number
  bus_line_station_type: string
  availableSeatsNumber: number
  city_id: 16
  city_name: string
}
type SelectedStation = {
  i: number | null
  id: number | null
}
type SelectedStations = {
  start: SelectedStation
  end: SelectedStation
}

const PlannedLine = ({
  id,
  company,
  seats,
  startDestination,
  endDestination,
  startTime,
  endTime,
  date,
  openEditLineModal,
  openModal
}: PlannedLine) => {
  const user: User | any = useAuthState().user

  const [plannedLineStations, setPlannedLineStations] = useState<Station[]>([])
  const [selectedStations, setSelectedStations] = useState<SelectedStations>({
    start: {
      i: null,
      id: null
    },
    end: {
      i: null,
      id: null
    }
  })
  const [loadingStations, setLoadingStations] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [price, setPrice] = useState<number | null>(null)
  const [secondPrice, setSecondPrice] = useState<number | null>(null)
  const [priceLoading, setPriceLoading] = useState(true)
  const [errorStations, setErrorStations] = useState("")

  function selectStation(i: number, id: number) {
    if (i === selectedStations.start.i) {
      setSelectedStations({
        ...selectedStations,
        start: { i: null, id: null }
      })
    } else if (i === selectedStations.end.i) {
      setSelectedStations({
        ...selectedStations,
        end: { i: null, id: null }
      })
    }
    if (selectedStations.start.i === null) {
      setSelectedStations({
        ...selectedStations,
        start: { i: i, id: id }
      })
    } else if (selectedStations.end.i === null) {
      setSelectedStations({
        ...selectedStations,
        end: { i: i, id: id }
      })
    } else {
      if (selectedStations.start.i > i) {
        setSelectedStations({
          ...selectedStations,
          start: { i: i, id: id }
        })
      } else if (selectedStations.end.i < i) {
        setSelectedStations({
          ...selectedStations,
          end: { i: i, id: id }
        })
      } else if (selectedStations.end.i > i && i > selectedStations.start.i) {
        if (
          selectedStations.end.i - i > i - selectedStations.start.i ||
          selectedStations.end.i - i === i - selectedStations.start.i
        ) {
          setSelectedStations({
            ...selectedStations,
            start: { i: i, id: id }
          })
        } else {
          setSelectedStations({
            ...selectedStations,
            end: { i: i, id: id }
          })
        }
      }
    }
  }

  function setEditLineModal() {
    if (price) {
      openEditLineModal(id, price)
      setIsCollapsed(false)
    }
  }

  function getPlannedLineStations(id: number) {
    setLoadingStations(true)
    axiosClient
      .get(`/bus-line-stations/all?bus_line_id=${id}`)
      .then((res) => {
        console.log(res.data)
        let tempStations = res.data.busLineStations
        setPlannedLineStations(
          tempStations.map((station: Station, i: number) => {
            if (station.bus_line_station_type === "POČETNO") {
              setSelectedStations({
                ...selectedStations,
                start: { i: i, id: station.bus_line_station_id }
              })
            }
            if (station.bus_line_station_type === "KRAJNJE") {
              setSelectedStations({
                ...selectedStations,
                end: { i: i, id: station.bus_line_station_id }
              })
            }
            return {
              arrives_at: station.arrives_at,
              bus_line_id: station.bus_line_id,
              bus_line_station_id: station.bus_line_station_id,
              bus_line_station_type: station.bus_line_station_type,
              availableSeatsNumber: station.availableSeatsNumber,
              city_id: station.city_id,
              city_name: station.city_name
            }
          })
        )
        let start: SelectedStation = {
          i: null,
          id: null
        }
        let end: SelectedStation = {
          i: null,
          id: null
        }
        for (let i = 0; i < tempStations.length; i++) {
          if (tempStations[i].bus_line_station_type === "POČETNO") {
            console.log("POČETNO")
            start = { i: i, id: tempStations[i].bus_line_station_id }
          }
          if (tempStations[i].bus_line_station_type === "KRAJNJE") {
            end = { i: i, id: tempStations[i].bus_line_station_id }
          }
        }
        setSelectedStations({
          start,
          end
        })
        setLoadingStations(false)
      })
      .catch((err) => {
        console.log("error", err)
        setLoadingStations(false)
      })
  }

  useEffect(() => {
    if (selectedStations.start.i !== null && selectedStations.end.i !== null) {
      axiosClient
        .get("/tickets/calculate-price", {
          params: {
            from_bus_line_station_id: selectedStations.start.id,
            to_bus_line_station_id: selectedStations.end.id
          }
        })
        .then((res) => {
          console.log(res.data)
          setPriceLoading(false)
          setPrice(res.data.price.oneWay)
          setSecondPrice(res.data.price.roundTrip)
        })
        .catch((err) => {
          console.log(err)
          setPriceLoading(false)
          setPrice(null)
          setSecondPrice(null)
        })
    } else {
      setPriceLoading(false)
      setPrice(null)
      setSecondPrice(null)
    }
  }, [selectedStations])

  return (
    <Accordion
      id={id}
      customClass=""
      onCollapse={getPlannedLineStations}
      isCollapsed={isCollapsed}
      header={
        <div className="row col-12 p-1">
          <div className="mb-3 mb-md-0 col-12 col-md-4 d-flex flex-column justify-content-center">
            <h4 className="header-title">{company || ""}</h4>
          </div>
          <div className="row col-12 col-md-8">
            <div className="col-12 col-md-8 d-flex justify-content-start justify-content-md-center align-items-center">
              <h4 className="header-title">
                {startDestination} - {endDestination}
              </h4>
            </div>
            <div className="col-12 col-md-4 d-flex justify-content-start align-items-center">
              {startTime} - {endTime}
            </div>
          </div>
        </div>
      }
      body={
        <div className="p-1">
          <div className="row">
            <div className="col-12 col-md-6 d-flex flex-column justify-content-start align-items-start">
              <h4 className="planned-line-subtitle mb-3">Stajališta:</h4>
              <div className="stations-list w-100">
                {loadingStations ? (
                  <Loading />
                ) : (
                  plannedLineStations.map((station, i) => {
                    let isSelected = false
                    let isColored = false
                    if (
                      station.bus_line_station_id ===
                        selectedStations.start.id ||
                      station.bus_line_station_id === selectedStations.end.id
                    ) {
                      isSelected = true
                      isColored = true
                    } else if (
                      selectedStations.start.i !== null &&
                      selectedStations.end.i !== null &&
                      i > selectedStations.start.i &&
                      i < selectedStations.end.i
                    ) {
                      isColored = true
                    }

                    return (
                      <div
                        key={i}
                        className={`station mb-3 ${
                          isColored ? "selected" : ""
                        }`}
                        onClick={() =>
                          selectStation(i, station.bus_line_station_id)
                        }
                      >
                        <div className="station-wrapper d-flex justify-content-between gap-3">
                          <h4 className="planned-line-subtitle mb-0">
                            {station.city_name} ({station.bus_line_station_type}
                            )
                          </h4>
                          <div className="station-info d-flex align-items-center gap-3">
                            <p className="station-time mb-0">
                              {station.arrives_at}
                            </p>
                            {isSelected ? (
                              <i className="fa-solid fa-circle-dot"></i>
                            ) : (
                              <i className="fa-solid fa-circle"></i>
                            )}
                          </div>
                        </div>
                        <p className="help-text">
                          Broj slobodnih mesta: {station.availableSeatsNumber}
                        </p>
                      </div>
                    )
                  })
                )}
                {plannedLineStations.length === 0 &&
                errorStations.length > 0 ? (
                  <p className="error-text">
                    Trenutno nema dostupnih informacija o stanicama za ovu
                    liniju
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="row col-12 col-md-6 d-flex justify-content-md-end align-items-start">
              <div className="col-12 d-flex flex-column align-items-start align-items-md-end">
                <h4 className="planned-line-subtitle mb-2">
                  Cena karte u jednom smeru
                </h4>
                {price && !priceLoading ? (
                  <button
                    id="price-1"
                    type="button"
                    onClick={() => {
                      openModal(
                        "U JEDNOM SMERU",
                        selectedStations.start.id,
                        selectedStations.end.id,
                        date,
                        seats,
                        price
                      )
                    }}
                    className={`btn btn-primary`}
                  >
                    <i className="fa-solid fa-arrow-right"></i> {price} RSD
                  </button>
                ) : !priceLoading ? (
                  <p className="help-text text-end">
                    Morate izabrati i početnu i krajnju destinaciju kako biste
                    učitali cenu.
                  </p>
                ) : (
                  <Loading />
                )}
              </div>
              <div className="col-12">
                <div className="col-12 d-flex flex-column align-items-start align-items-md-end">
                  <h4 className="planned-line-subtitle mb-2">
                    Cena povratne karte
                  </h4>
                  {secondPrice && !priceLoading ? (
                    <button
                      id="price-2"
                      type="button"
                      onClick={() => {
                        openModal(
                          "POVRATNA",
                          selectedStations.start.id,
                          selectedStations.end.id,
                          date,
                          seats,
                          secondPrice
                        )
                      }}
                      className={`btn btn-primary`}
                    >
                      <i className="fa-solid fa-arrow-right-arrow-left"></i>{" "}
                      {secondPrice} RSD
                    </button>
                  ) : !priceLoading ? (
                    <p className="help-text text-end">
                      Morate izabrati i početnu i krajnju destinaciju kako biste
                      učitali cenu.
                    </p>
                  ) : (
                    <Loading />
                  )}
                </div>
              </div>
              {Object.keys(user).length > 0 && user.role_id === 1 ? (
                <div className="col-12 d-flex justify-content-end mt-4">
                  <p
                    className="info-text link"
                    onClick={() => setEditLineModal()}
                  >
                    Edit
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      }
    />
  )
}

export default PlannedLine

import React, { useEffect, useState } from "react"
import Accordion from "../Accordion/Accordion"
import "./planned-line.css"
import axiosClient from "../../axios/axiosClient"
import Loading from "../Loading/Loading"

interface PlannedLine {
  id: number
  company: string
  seats: number
  seatsTotal: number
  startDestination: string
  endDestination: string
  startTime: string
  endTime: string
  openModal: (params: number) => any
}

type Station = {
  arrives_at: string
  bus_line_id: number
  bus_line_station_id: number
  bus_line_station_type: string
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
  openModal
}: PlannedLine) => {
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
  const [errorStations, setErrorStations] = useState("")

  function selectStation(i: number, id: number) {
    if (!selectedStations.start.i) {
      setSelectedStations({
        ...selectedStations,
        start: {
          i: i,
          id: id
        }
      })
      return
    }
    if (!selectedStations.end.i) {
      setSelectedStations({
        ...selectedStations,
        end: {
          i: i,
          id: id
        }
      })
      return
    }
    if (selectedStations.start.i) {
      if (i < selectedStations.start.i) {
        setSelectedStations({
          ...selectedStations,
          start: {
            i: i,
            id: id
          }
        })
        return
      } else if (selectedStations.start.id === id) {
        setSelectedStations({
          ...selectedStations,
          start: {
            i: null,
            id: null
          }
        })
      }
    }
    if (selectedStations.end.i) {
      if (i < selectedStations.end.i) {
        setSelectedStations({
          ...selectedStations,
          end: {
            i: i,
            id: id
          }
        })
        return
      } else if (selectedStations.end.id === id) {
        setSelectedStations({
          ...selectedStations,
          end: {
            i: null,
            id: null
          }
        })
      }
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
          tempStations.map((station: Station) => {
            return {
              arrives_at: station.arrives_at,
              bus_line_id: station.bus_line_id,
              bus_line_station_id: station.bus_line_station_id,
              bus_line_station_type: station.bus_line_station_type,
              city_id: station.city_id,
              city_name: station.city_name
            }
          })
        )
        for (let i = 0; i < tempStations.length; i++) {
          if (tempStations[i].bus_line_station_type === "POČETNO") {
            setSelectedStations({
              ...selectedStations,
              start: { i: i, id: tempStations[i].bus_line_station_id }
            })
          }
          if (tempStations[i].bus_line_station_type === "KRAJNJE") {
            setSelectedStations({
              ...selectedStations,
              end: { i: i, id: tempStations[i].bus_line_station_id }
            })
          }
        }
        setLoadingStations(false)
      })
      .catch((err) => {
        console.log("error", err)
        setLoadingStations(false)
      })
  }

  useEffect(() => {}, [selectedStations])

  return (
    <Accordion
      id={id}
      onCollapse={getPlannedLineStations}
      header={
        <div className="row col-12 p-1">
          <div className="col-6 col-md-4 d-flex flex-column justify-content-center">
            <h4 className="header-title">{company || ""}</h4>
            <p className="header-info mb-0">Broj slobodnih mesta: {seats}</p>
          </div>
          <div className="row col-6 col-md-8">
            <div className="col-12 col-md-8 d-flex justify-content-end justify-content-md-center align-items-center">
              <h4 className="header-title">
                {startDestination} - {endDestination}
              </h4>
            </div>
            <div className="col-12 col-md-4 d-flex justify-content-end align-items-center">
              {startTime} - {endTime}
            </div>
          </div>
        </div>
      }
      body={
        <div className="p-1">
          <div className="row">
            <div className="col-12 col-md-6 d-flex flex-column justify-content-start align-items-start">
              <h4 className="station-title mb-3">Stajališta:</h4>
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
                      selectedStations.start.i &&
                      selectedStations.end.i &&
                      i > selectedStations.start.i &&
                      i < selectedStations.end.i
                    ) {
                      isColored = true
                    }

                    return (
                      <div
                        key={i}
                        className={`station d-flex justify-content-between gap-3 mb-3 ${
                          isColored ? "selected" : ""
                        }`}
                        onClick={() =>
                          selectStation(i, station.bus_line_station_id)
                        }
                      >
                        <h4 className="station-title mb-0">
                          {station.city_name} ({station.bus_line_station_type})
                        </h4>
                        <div className="station-info d-flex align-items-center gap-3">
                          <p className="station-time mb-0">
                            {station.arrives_at}
                          </p>
                          {isSelected ? (
                            <i className="fa-solid fa-circle"></i>
                          ) : isColored ? (
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                          ) : (
                            <i className="fa-solid fa-circle-dot"></i>
                          )}
                        </div>
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
            <div className="col-4 col-md-6 d-flex justify-content-end align-items-center">
              <button
                type="button"
                onClick={() => {
                  openModal(1)
                }}
              >
                - 1.200,00 RSD
              </button>
            </div>
          </div>
        </div>
      }
    />
  )
}

export default PlannedLine

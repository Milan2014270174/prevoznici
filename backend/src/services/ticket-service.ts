/* eslint-disable @typescript-eslint/no-unsafe-call */
import ticketRepo from "../database/ticket-repo";
import { ITicket } from "../models/ticket-model";
import busLineStationRepo from '../database/bus_line_station-repo'
import busLineRepo from '../database/bus_line-repo'


/**
 * Get all tickets.
 * 
 * @returns 
 */
function getAll(): Promise<ITicket[]> {
  return ticketRepo.getAll();
}

/**
 * Get all user's tickets.
 * @param uid
 * @returns 
 */
function getUsersTickets(uid: number): Promise<ITicket[]> {

  return ticketRepo.getByUserId(uid, true);
}

async function update(ticketId: number, ticket: ITicket) {

  await ticketRepo.update(ticketId, ticket);
}


/**
 * Add one ticket.
 * 
 * @param ticket 
 * @returns 
 */
async function addOne(ticket: ITicket): Promise<ITicket | null> {

  const busLineStationFrom = await busLineStationRepo.getById(ticket.from_bus_line_station_id);
  const busLineStationTo = await busLineStationRepo.getById(ticket.to_bus_line_station_id);

  if (!busLineStationFrom || !busLineStationTo)
    throw new Error('Ne postoje ove stanice')

  const busLineId = busLineStationFrom?.bus_line_id;
  const busline = await busLineRepo.getById(busLineId);

  const busLineTickets = await ticketRepo.getByBusLineId(busLineId, true)


  if (!busline)
    throw new Error('Ova linija ne postoji');

  const allStationsOnLine = await busLineStationRepo.getByBusLineId(busLineId);

  const seatCalculations = getSeatCalculations(allStationsOnLine, busline, busLineTickets);

  if (
    seatCalculations[ticket.from_bus_line_station_id].reservedSeatsNumber
    > busline.available_seats - 1) {
    throw new Error('Nema dovoljno mesta na ovoj stanici.');
  }

  ticket.seat_number = seatCalculations[ticket.from_bus_line_station_id].freeSeats[0];

  const firstStation = allStationsOnLine.find(bls => bls.bus_line_station_type === 'POČETNO');
  const lastStation = allStationsOnLine.find(bls => bls.bus_line_station_type === 'KRAJNJE');

  if (!firstStation)
    throw new Error('Ova linija nema pocetnu stanicu')

  if (!lastStation)
    throw new Error('Ova linija nema krajnju stanicu')

  ticket.ticket_price = calculatePrice({
    fromTime: busLineStationFrom.arrives_at,
    toTime: busLineStationTo.arrives_at,
    maxToTime: lastStation?.arrives_at,
    maxFromTime: firstStation?.arrives_at,
    fullPrice: busline.bus_line_price
  })

  let expiresAt = null

  if (ticket.ticket_type == 'POVRATNA') {
    const resrvedDateAt = new Date(busline.reserved_date_at)

    expiresAt = new Date(resrvedDateAt.setMonth(resrvedDateAt.getMonth() + 2)).toISOString();
  }
  return ticketRepo.create({
    ...ticket,
    roundtrip_expires_at: expiresAt
  });
}

function calculatePrice({
  maxFromTime, maxToTime, fullPrice, fromTime, toTime
}: {
  maxFromTime: string, maxToTime: string, fullPrice: number, fromTime: string, toTime: string
}) {
  const minutesMaxFrom = timeToMinutes(maxFromTime);
  const minutesMaxTo = timeToMinutes(maxToTime);
  const minutesFrom = timeToMinutes(fromTime);
  const minutesTo = timeToMinutes(toTime);

  const maxMinutes = minutesMaxFrom - minutesMaxTo;
  const minutesRange = minutesFrom - minutesTo;

  return Math.round((minutesRange / maxMinutes) * fullPrice);


}

function timeToMinutes(time: string) {
  const hm = time;   // your input string
  const a = hm.split(':'); // split it at the colons

  const minutes = (+a[0]) * 60 + (+a[1]);

  return minutes;
}

function getSeatCalculations(
  allLineStations: any[], busline: { available_seats: number; }, busLineTickets: any[]
): any {
  const seatCalculations: any = {};

  for (let index = 0; index < allLineStations.length; index++) {

    seatCalculations[allLineStations[index].bus_line_station_id + ''] = {}
    seatCalculations[allLineStations[index].bus_line_station_id + ''].reservedSeatsNumber = 0;
    seatCalculations[allLineStations[index].bus_line_station_id + ''].freeSeats
      = [...Array(busline.available_seats).keys()].map(x => ++x + '');
  }



  busLineTickets.forEach((ticket:
    { to_bus_line_station_id: any; from_bus_line_station_id: any; seat_number: string; }
  ) => {

    const iTo =
      allLineStations.findIndex((station: { bus_line_station_id: any; }) =>
        station.bus_line_station_id == ticket.to_bus_line_station_id
      );

    const iFrom =
      allLineStations.findIndex((station: { bus_line_station_id: any; }) =>
        station.bus_line_station_id == ticket.from_bus_line_station_id
      );


    for (let index = iFrom; index <= iTo; index++) {

      seatCalculations[allLineStations[index].bus_line_station_id + ''].reservedSeatsNumber += 1;
      seatCalculations[allLineStations[index].bus_line_station_id + ''].freeSeats =
        seatCalculations[allLineStations[index].bus_line_station_id + ''].freeSeats
          .filter((seat: string) => seat != ticket.seat_number);
    }
  })

  return seatCalculations;
}

function getSeatCalculationsOnlyNumberOfFreeSeats(
  allLineStations: any[], busline: { available_seats: number; }, busLineTickets: any[]
): any {
  const seatCalculations: any = {};

  for (let index = 0; index < allLineStations.length; index++) {

    seatCalculations[allLineStations[index].bus_line_station_id + ''] = {}
    seatCalculations[allLineStations[index].bus_line_station_id + ''].reservedSeatsNumber = 0;
  }



  busLineTickets.forEach((ticket:
    { to_bus_line_station_id: any; from_bus_line_station_id: any; seat_number: string; }
  ) => {

    const iTo =
      allLineStations.findIndex((station: { bus_line_station_id: any; }) =>
        station.bus_line_station_id == ticket.to_bus_line_station_id
      );

    const iFrom =
      allLineStations.findIndex((station: { bus_line_station_id: any; }) =>
        station.bus_line_station_id == ticket.from_bus_line_station_id
      );


    for (let index = iFrom; index <= iTo; index++) {

      seatCalculations[allLineStations[index].bus_line_station_id + ''].reservedSeatsNumber += 1;
    }
  })

  return seatCalculations;
}

async function createTicketDryRun(ticket: any) {
  const busLineStationFrom = await busLineStationRepo.getById(ticket.from_bus_line_station_id);
  const busLineStationTo = await busLineStationRepo.getById(ticket.to_bus_line_station_id);

  if (!busLineStationFrom || !busLineStationTo)
    throw new Error('Ne postoje ove stanice')

  const busLineId = busLineStationFrom?.bus_line_id;
  const busline = await busLineRepo.getById(busLineId);

  const busLineTickets = await ticketRepo.getByBusLineId(busLineId, true)


  if (!busline)
    throw new Error('Ova linija ne postoji');

  const allStationsOnLine = await busLineStationRepo.getByBusLineId(busLineId);

  const seatCalculations = getSeatCalculations(allStationsOnLine, busline, busLineTickets);

  if (
    seatCalculations[ticket.from_bus_line_station_id].reservedSeatsNumber
    > busline.available_seats - 1) {
    throw new Error('Nema dovoljno mesta na ovoj stanici.');
  }

  ticket.seat_number = seatCalculations[ticket.from_bus_line_station_id].freeSeats[0];

  const firstStation = allStationsOnLine.find(bls => bls.bus_line_station_type === 'POČETNO');
  const lastStation = allStationsOnLine.find(bls => bls.bus_line_station_type === 'KRAJNJE');

  if (!firstStation)
    throw new Error('Ova linija nema pocetnu stanicu')

  if (!lastStation)
    throw new Error('Ova linija nema krajnju stanicu')

  ticket.ticket_price = calculatePrice({
    fromTime: busLineStationFrom.arrives_at,
    toTime: busLineStationTo.arrives_at,
    maxToTime: lastStation?.arrives_at,
    maxFromTime: firstStation?.arrives_at,
    fullPrice: busline.bus_line_price
  })

  return ticket.ticket_price;
}



// Export default
export default {
  // delete: deleteOne,
  getUsersTickets,
  createTicketDryRun,
  getSeatCalculationsOnlyNumberOfFreeSeats,
  getAll,
  addOne,
  update
} as const;

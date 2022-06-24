import { UserNotFoundError } from '@shared/errors';
import { IBusLineStation } from '../models/bus_line_station-model';
import busLineStationRepo from '../database/bus_line_station-repo';
import busLineRepo from '../database/bus_line-repo';
import ticketRepo from '../database/ticket-repo';
import ticketService from './ticket-service';

/**
 * Add one busLineStation.
 * 
 * @param busLineStation 
 * @returns 
 */
async function create(busLineStation: IBusLineStation) {

  const buslineStations = await busLineStationRepo.getByBusLineId(busLineStation.bus_line_id);

  const stationType = busLineStation.bus_line_station_type;

  if ((['POČETNO', 'KRAJNJE'].includes(stationType)) && buslineStations.find(bls => bls.bus_line_station_type == stationType))
    throw new Error(`Ova linija već ima ${stationType.toLowerCase()} stajalište.`)

  return busLineStationRepo.create(busLineStation);
}

/**
 * Delete a busLineStation by their id.
 * 
 * @param id 
 * @returns 
 */
async function deleteOne(id: number): Promise<boolean> {

  return busLineStationRepo.deleteById(id);
}
/**
 * Delete a busLineStation by their id.
 * 
 * @param id 
 * @returns 
 */
async function getByBusLineId(id: number):
  Promise<any[]> {

  const busLineStations = await busLineStationRepo.getByBusLineId(id, true);
  const busLine = await busLineRepo.getById(busLineStations[0].bus_line_id);

  if (!busLine) throw new Error('Nepoznata greska na serveru.')

  const busLineTickets = await ticketRepo.getByBusLineId(busLine.bus_line_id as number)


  const seatCalculations =
    ticketService
      .getSeatCalculationsOnlyNumberOfFreeSeats(busLineStations,
        { available_seats: busLine.available_seats },
        busLineTickets);

  busLineStations.forEach((bls, index) => {
    busLineStations[index].availableSeatsNumber =
      busLine.available_seats -
      seatCalculations[busLineStations[index].bus_line_station_id].reservedSeatsNumber
  })

  console.log(busLineStations);

  return busLineStations;
}


// Export default
export default {
  getByBusLineId,
  create,
  // updateOne,
  delete: deleteOne,
} as const;

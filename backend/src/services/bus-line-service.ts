import busLineRepo from '../database/bus_line-repo';
import busLineStationRepo from '../database/bus_line_station-repo';
import { UserNotFoundError } from '@shared/errors';
import { IBusLine } from '../models/bus_line-model';
import { IBusLineStation } from '../models/bus_line_station-model';



/**
 * Get all busLines.
 * 
 * @returns 
 */
function getAll(): Promise<IBusLine[]> {
  return busLineRepo.getAll();
}


/**
 * Add one busLine.
 * 
 * @param busLine 
 * @returns 
 */
async function create(busLine: IBusLine, stations: IBusLineStation[]) {

  const insertedBusLine = await busLineRepo.create(busLine);

  if (!insertedBusLine) throw new Error('Greška prilikom unosa linije.');

  const modifiedStations = stations.map(station => ({
    ...station,
    bus_line_id: insertedBusLine.bus_line_id as number
  }))

  await busLineStationRepo.createMany(modifiedStations);


  return insertedBusLine;
}


/**
 * Update one busLine.
 * 
 * @param busLine 
 * @returns 
 */
async function updateOne(busLine: IBusLine, stations: IBusLineStation[]): Promise<void> {

  await busLineRepo.update(busLine.bus_line_id as number, busLine);

  stations.forEach(station => {
    busLineStationRepo.update(station.bus_line_station_id, station)
  });
}


// /**
//  * Delete a busLine by their id.
//  * 
//  * @param id 
//  * @returns 
//  */
// async function deleteOne(id: number): Promise<void> {
//   const persists = await busLineRepo.persists(id);
//   if (!persists) {
//     throw new UserNotFoundError();
//   }
//   return busLineRepo.delete(id);
// }


// Export default
export default {
  getAll,
  create,
  updateOne,
  // delete: deleteOne,
} as const;

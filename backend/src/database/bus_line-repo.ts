import * as db from './database-connector';
import { getRandomInt } from '@shared/functions';
import { IBusLine } from '../models/bus_line-model';
import { IBusLineStation } from '../models/bus_line_station-model';
import busLineStationRepo from './bus_line_station-repo';
import { ICity } from '../models/city-model';
import cityRepo from './city-repo';

const TABLE = 'bus_line';

const RELATED_TABLES = {
  COMPANY: 'company',
  STATION: 'station',
  BUS_LINE_STATION: 'bus_line_station'
}

const JOIN_TABLES = {
  COMPANY: `
    INNER JOIN ${RELATED_TABLES.COMPANY}
    ON ${TABLE}.company_id = ${RELATED_TABLES.COMPANY}.company_id
    `
}


/**
 * Get one bus_line.
 * 
 * @param bus_line_id 
 * @returns 
 */
async function getById(bus_line_id: number, withStations = false): Promise<IBusLine | null> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} 
    ${JOIN_TABLES.COMPANY}
    WHERE bus_line_id = ?`, [bus_line_id]
  ));
  const bus_line = rows[0] as IBusLine;
  if (withStations)
    bus_line.stations = await loadStations(bus_line.bus_line_id as number);
  if (!bus_line) null;


  return bus_line;
}


/**
 * Creates a new bus line
 * 
 * @param {IBusLine} params
 * @returns {*}  {(Promise<IBusLine | null>)}
 */
async function create(params: IBusLine): Promise<IBusLine | null> {
  const { rows, fields, result } = (await db.query(
    `INSERT INTO ${TABLE} SET ?`, params
  ));


  if (!result?.affectedRows) {

    return null;
  }
  const bus_line = await getById(result.insertId as number);


  return bus_line;
}


/**
 * Get all bus_lines.
 * 
 * @returns 
 */
async function getAll(): Promise<IBusLine[]> {

  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} ${JOIN_TABLES.COMPANY}
     JOIN bus_line_station bls ON bls.bus_line_id = bus_line.bus_line_id
     JOIN city ON bls.city_id = city.city_id
     WHERE bls.bus_line_station_type = 'POČETNO' OR
     bls.bus_line_station_type = 'KRAJNJE'
    `
  ));



  const bus_lines = rows as (IBusLine & IBusLineStation)[];

  console.log(bus_lines);

  const toReturn = [] as any[];


  for (let index = 0; index < bus_lines.length; index++) {
    const element = bus_lines[index];

    const indexInNewArray = toReturn.findIndex((tr: any) => tr.bus_line_id == element.bus_line_id);

    if (indexInNewArray == -1) {
      const newLength = toReturn.push(element);

      toReturn[newLength - 1][element.bus_line_station_type] = {
        city_name: element.city_name,
        arrives_at: element.arrives_at,
        bus_line_station_id: element.bus_line_station_id,
        city_id: element.city_id
      };
    } else {

      toReturn[indexInNewArray][element.bus_line_station_type] = {
        city_name: element.city_name,
        arrives_at: element.arrives_at,
        bus_line_station_id: element.bus_line_station_id,
        city_id: element.city_id
      };
    }

  }


  // for (const busLine of bus_lines) {

  //   busLine.stations = await loadStations(busLine.bus_line_id as number);
  // }

  return toReturn;
}


async function loadStations(bus_line_id: number):
  Promise<(ICity & { arrives_at: string, bus_line_station_type: string })[]> {


  const busLineStations = await busLineStationRepo.getByBusLineId(bus_line_id);

  const stations = [];
  for (const bls of busLineStations) {

    const station = await cityRepo.getById(bls.station_id);

    if (station)
      stations.push({
        ...station,
        arrives_at: bls.arrives_at,
        bus_line_station_type: bls.bus_line_station_type
      });
  }

  return stations;
}

/**
 * Update one busLine.
 * 
 * @param bus_line_id 
 * @param busLine 
 * @returns 
 */
async function update(bus_line_id: number, update: IBusLine) {
  const query = `Update ${TABLE} SET ${Object.keys(update).map(key => `${key} = ?`).join(", ")} WHERE bus_line_id = ?`;
  const parameters = [...Object.values(update), bus_line_id];
  const { rows, result } = await db.query(query, parameters);

  if (!result?.affectedRows) {

    return null;
  }

  return rows;
}


// Export default
export default {
  getById,
  getAll,
  update,
  create
} as const;

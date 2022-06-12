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
    `SELECT * FROM ${TABLE} ${JOIN_TABLES.COMPANY}`
  ));

  const bus_lines = rows as IBusLine[];

  // for (const busLine of bus_lines) {

  //   busLine.stations = await loadStations(busLine.bus_line_id as number);
  // }

  return bus_lines;
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

// Export default
export default {
  getById,
  getAll,
  create
} as const;

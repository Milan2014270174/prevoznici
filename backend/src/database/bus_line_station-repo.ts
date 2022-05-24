import * as db from './database-connector';
import { getRandomInt } from '@shared/functions';
import { IStation } from '../models/station';
import { IBusLineStation } from '../models/bus_line_station-model';


const TABLE = 'bus_line_station';


const RELATED_TABLES = {
  STATION: 'station',
}

const JOIN_TABLES = {
  STATION: `
    INNER JOIN ${RELATED_TABLES.STATION}
    ON ${TABLE}.station_id = ${RELATED_TABLES.STATION}.station_id
    `
}

/**
 * Get one bus_line_station.
 * 
 * @param bus_line_station_id 
 * @returns 
 */
async function getById(bus_line_station_id: number): Promise<IBusLineStation | null> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} WHERE bus_line_station_id = ?`, [bus_line_station_id]
  ));
  const bus_line_station = rows[0] as IBusLineStation;
  if (!bus_line_station) null;


  return bus_line_station;
}
/**
 * Get all bus_line_stations by a bus_line_id.
 * 
 * @param bus_line_id 
 * @returns 
 */
async function getByBusLineId(bus_line_id: number, joinStations = false):
  Promise<IBusLineStation[]> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} 
    ${joinStations ? JOIN_TABLES.STATION : ''}
    WHERE bus_line_id = ?
    ORDER BY arrives_at
    `, [bus_line_id]
  ));
  const bus_line_station = rows as IBusLineStation[];
  if (!bus_line_station) null;


  return bus_line_station;
}


/**
 * Creates a new bus line
 * 
 * @param {IBusLineStation} params
 * @returns {*}  {(Promise<IBusLineStation | null>)}
 */
async function create(params: IBusLineStation): Promise<IBusLineStation | null> {
  const { rows, fields, result } = (await db.query(
    `INSERT INTO ${TABLE} SET ?`, params
  ));

  if (!result.affectedRows) {

    return null;
  }
  const bus_line_station = await getById(result.insertId as number);


  return bus_line_station;
}

/**
 * Get all bus_lines.
 * 
 * @returns 
 */
async function getAll(): Promise<IBusLineStation[]> {

  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE}`
  ));

  const bus_lines = rows as IBusLineStation[];

  return bus_lines;
}

async function deleteById(company_id: number) {

  const { rows, fields } = (await db.query(
    `DELETE FROM ${TABLE} WHERE company_id = ?`, [company_id]
  ));

  return true;
}



// Export default
export default {
  getById,
  getByBusLineId,
  getAll,
  deleteById,
  create
} as const;


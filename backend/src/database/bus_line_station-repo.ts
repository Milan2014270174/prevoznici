import * as db from './database-connector';
import { getRandomInt } from '@shared/functions';
import { IBusLineStation } from '../models/bus_line_station-model';


const TABLE = 'bus_line_station';


const RELATED_TABLES = {
  CITY: 'city'
}

const JOIN_TABLES = {
  CITY: `
    INNER JOIN ${RELATED_TABLES.CITY}
    ON ${RELATED_TABLES.CITY}.city_id = ${RELATED_TABLES.CITY}.city_id
    `,
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
async function getByBusLineId(bus_line_id: number, joinCity = false):
  Promise<IBusLineStation[]> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} 
    ${joinCity ? JOIN_TABLES.CITY : ''}
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


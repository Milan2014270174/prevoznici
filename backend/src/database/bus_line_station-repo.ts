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
    ON ${TABLE}.city_id = ${RELATED_TABLES.CITY}.city_id
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
 * Creates a new bus line station
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
 * Create multiple bus line statons
 * 
 * @param {IBusLineStation} params
 * @returns {*}  {(Promise<IBusLineStation | null>)}
 */
async function createMany(params: IBusLineStation[]): Promise<IBusLineStation | null> {


  const { rows, fields, result } = (await db.query(
    `INSERT INTO ${TABLE} (arrives_at, bus_line_station_type, city_id, bus_line_id) VALUES ?`, [params.map(item => [item.arrives_at, item.bus_line_station_type, item.city_id, item.bus_line_id])]
  ));

  if (!result.affectedRows) {

    return null;
  }
  const bus_line_station = await getById(result.insertId as number);


  return bus_line_station;
}

/**
 * Update one busLineStation.
 * 
 * @param bus_line_station_id 
 * @param busLine 
 * @returns 
 */
async function update(bus_line_station_id: number, update: IBusLineStation) {
  const query = `Update ${TABLE} SET ${Object.keys(update).map(key => `${key} = ?`).join(", ")} WHERE bus_line_station_id = ?`;
  const parameters = [...Object.values(update), bus_line_station_id];
  const { rows, result } = await db.query(query, parameters);

  if (!result?.affectedRows) {

    return null;
  }

  return rows;
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
  update,
  create,
  createMany
} as const;


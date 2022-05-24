import * as db from './database-connector';
import { getRandomInt } from '@shared/functions';
import { IStation } from '../models/station';

const TABLE = 'station';

const RELATED_TABLES = {
  CITY: 'city'
}

const JOIN_TABLES = {
  CITY: `
    INNER JOIN ${RELATED_TABLES.CITY}
    ON ${TABLE}.city_id = ${RELATED_TABLES.CITY}.city_id
    `
}

/**
 * Get one station.
 * 
 * @param email 
 * @returns 
 */
async function getById(station_id: number): Promise<IStation | null> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} ${JOIN_TABLES.CITY}
    WHERE station_id = ?`, [station_id]
  ));
  const station = rows[0] as IStation;
  if (!station) null;
  return station;
}

/**
 * Get stations by ids.
 * 
 * @param email 
 * @returns 
 */
async function getByIds(stationIds: number[]): Promise<IStation | null> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} ${JOIN_TABLES.CITY}
    WHERE station_id IN (?)`, [stationIds.join(", ")]
  ));
  const station = rows[0] as IStation;
  if (!station) null;
  return station;
}

/**
 * Get one station.
 * 
 * @param email 
 * @param password 
 * @param name
 * @returns 
 */
async function create(params: IStation): Promise<IStation | null> {
  const { rows, fields } = (await db.query(
    `INSERT INTO ${TABLE} SET ?`, params
  ));

  const station = rows[0] as IStation;
  if (!station) null;

  return station;
}

/**
 * Get all companies.
 * 
 * @returns 
 */
async function getAll(): Promise<IStation[]> {

  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} ${JOIN_TABLES.CITY}`
  ));

  const companies = rows as IStation[];

  return companies;
}

/**
 * Delete a station by id.
 * 
 * @param station_id
 * @returns 
 */
async function deleteById(station_id: number): Promise<IStation[]> {

  const { rows, fields } = (await db.query(
    `DELETE FROM ${TABLE} WHERE station_id = ?`, [station_id]
  ));

  const companies = rows as IStation[];

  return companies;
}

// Export default
export default {
  getById,
  getByIds,
  deleteById,
  getAll,
  create
} as const;

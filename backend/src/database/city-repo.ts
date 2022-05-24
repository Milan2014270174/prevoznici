import * as db from './database-connector';
import { getRandomInt } from '@shared/functions';
import { ICity } from '../models/city-model';


const TABLE = 'city';
/**
 * Get one city.
 * 
 * @param email 
 * @returns 
 */
async function getById(city_id: number): Promise<ICity | null> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} WHERE city_id = ?`, [city_id]
  ));
  const city = rows[0] as ICity;
  if (!city) null;
  return city;
}

/**
 * Get one city.
 * 
 * @param email 
 * @param password 
 * @param name
 * @returns 
 */
async function create(params: ICity): Promise<ICity | null> {
  const { rows, fields } = (await db.query(
    `INSERT INTO ${TABLE} SET ?`, params
  ));

  const city = rows[0] as ICity;
  if (!city) null;

  return city;
}


/**
 * Get all users.
 * 
 * @returns 
 */
async function getAll(): Promise<ICity[]> {

  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE}`
  ));

  const users = rows as ICity[];

  return users;
}


// Export default
export default {
  getById,
  getAll,
  create
} as const;

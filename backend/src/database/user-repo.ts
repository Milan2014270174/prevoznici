import { IUser } from '@models/user-model';
import * as db from './database-connector';
import { getRandomInt } from '@shared/functions';


const TABLE = 'user';

/**
 * Get one user.
 * 
 * @param email 
 * @returns 
 */
async function getByEmail(email: string): Promise<IUser | null> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} WHERE email = ?`, [email]
  ));
  const user = rows[0] as IUser;
  if (!user) null;
  console.log(user);
  return user;
}

/**
 * Get one user.
 * 
 * @param id 
 * @returns 
 */
async function getById(user_id: number): Promise<IUser | null> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} WHERE user_id = ?`, [user_id]
  ));
  const user = rows[0] as IUser;
  if (!user) null;
  console.log(user);
  return user;
}

/**
 * Get one user.
 * 
 * @param email 
 * @param password 
 * @param name
 * @returns 
 */
async function create(params: IUser): Promise<IUser | null> {
  const { rows, fields, result } = (await db.query(
    `INSERT INTO ${TABLE} SET ?`, params
  ));

  if (!result.affectedRows) {

    return null;
  }
  const user = await getById(result.insertId as number);


  return user;
}


/**
 * Get all users.
 * 
 * @returns 
 */
async function getAll(): Promise<IUser[]> {

  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE}`
  ));

  const users = rows as IUser[];

  return users;
}


// Export default
export default {
  getByEmail,
  getAll,
  create
} as const;

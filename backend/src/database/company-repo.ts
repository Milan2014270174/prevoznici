import * as db from './database-connector';
import { getRandomInt } from '@shared/functions';
import { ICompany } from '../models/company-model';


const TABLE = 'company';
/**
 * Get one company.
 * 
 * @param email 
 * @returns 
 */
async function getById(company_id: number): Promise<ICompany | null> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} WHERE company_id = ?`, [company_id]
  ));
  const company = rows[0] as ICompany;
  if (!company) null;
  return company;
}

/**
 * Create a company.
 * 
 * @param company_name 
 * @returns 
 */
async function create(params: ICompany): Promise<ICompany | null> {
  const { rows, fields, result } = (await db.query(
    `INSERT INTO ${TABLE} SET ?`, params
  ));



  if (!result.affectedRows) {

    return null;
  }
  const company = await getById(result.insertId as number);

  return company;
}

/**
 * Get all companies.
 * 
 * @returns 
 */
async function getAll(): Promise<ICompany[]> {

  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE}`
  ));

  const companies = rows as ICompany[];

  return companies;
}

/**
 * Delete a company by id.
 * 
 * @param company_id
 * @returns 
 */
async function deleteById(company_id: number): Promise<ICompany[]> {

  const { rows, fields } = (await db.query(
    `DELETE FROM ${TABLE} WHERE company_id = ?`, [company_id]
  ));

  const companies = rows as ICompany[];

  return companies;
}

// Export default
export default {
  getById,
  deleteById,
  getAll,
  create
} as const;

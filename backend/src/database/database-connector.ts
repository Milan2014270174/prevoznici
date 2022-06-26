/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */

import mysql, { FieldPacket, RowDataPacket } from "mysql2";
require('dotenv').config({ path: `./scraper/data-poster/.env` })
const NODE_ENV = process.env.NODE_ENV || "local";
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'autobuske_karte',
  password: '',
  dateStrings: true,
});

export const connection = conn;
export const query = (sql: string, data: any = null):
  Promise<{ rows: RowDataPacket[], fields: FieldPacket[], result: any }> => {

  if (data)
    return new Promise((res, rej) => {
      conn.query(sql, data, (err, result, fields) => {
        if (err) {
          console.log(err);
        }

        const rows = (<RowDataPacket[]>result);
        res({ rows, fields, result })
      })
    })

  return new Promise((res, rej) => {
    conn.query(sql, (err, result, fields) => {
      if (err) {
        console.log(err);
      }

      const rows = (<RowDataPacket[]>result);
      res({ rows, fields, result })
    })
  })
}
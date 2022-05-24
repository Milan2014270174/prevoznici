/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */

import mysql, { FieldPacket, RowDataPacket } from "mysql2";
require('dotenv').config({ path: `./scraper/data-poster/.env` })
const NODE_ENV = process.env.NODE_ENV || "local";
const conn = mysql.createConnection({
  host: process.env.DB_HOST || "185.119.88.30",
  user: process.env.DB_USERNAME || "lightbul_autobuske_karte",
  database: process.env.DB_DATABASE || "lightbul_autobuske_karte",
  password: process.env.DB_PASSWORD || "S0&qHEC;I7(*",
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
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
async function getById(bus_line_id: number): Promise<IBusLine | null> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} 
    ${JOIN_TABLES.COMPANY}
    JOIN bus_line_station bls ON bls.bus_line_id = bus_line.bus_line_id
    JOIN city ON bls.city_id = city.city_id
    WHERE bus_line.bus_line_id = ? AND
    (bls.bus_line_station_type = 'POČETNO' OR
    bls.bus_line_station_type = 'KRAJNJE')
    `, [bus_line_id]
  ));
  const bus_lines = rows as (IBusLine & IBusLineStation)[];;
  if (!bus_lines) null

  const toReturn = formatBusLines(bus_lines);

  return toReturn[0] as IBusLine;
}


/**
 * Creates a new bus line
 * 
 * @param {IBusLine} params
 * @returns {*}  {(Promise<IBusLine | null>)}
 */
async function create(params: IBusLine): Promise<{ bus_line_id: number } | null> {
  const { rows, fields, result } = (await db.query(
    `INSERT INTO ${TABLE} SET ?`, params
  ));


  if (!result?.affectedRows) {

    return null;
  }

  return {
    bus_line_id: result.insertId
  };
}

async function getByCityIds(cityFrom: number, cityTo: number, date: string, company_id?:number) {
  let sql = `
  SELECT * 
  FROM bus_line
  ${JOIN_TABLES.COMPANY}
  JOIN bus_line_station bls ON bls.bus_line_id = bus_line.bus_line_id
  JOIN city ON bls.city_id = city.city_id
  WHERE (bls.bus_line_station_type = "POČETNO" OR
  bls.bus_line_station_type = "KRAJNJE") AND
  (
    SELECT COUNT(*)
    FROM bus_line_station blsOd
    WHERE
    	blsOd.bus_line_id = bus_line.bus_line_id AND
    	blsOd.city_id = ? AND
    	(
    		SELECT COUNT(*)
    		FROM bus_line_station blsDo
    		WHERE
    			blsDo.bus_line_id = bus_line.bus_line_id AND
    			blsDo.city_id = ? AND
            	blsDo.arrives_at > blsOd.arrives_at
    	) > 0
    ) > 0 AND
    bus_line.reserved_date_at = DATE(?) 
    `
  
  if (company_id)
    sql += `AND bus_line.company_id = ${company_id}`;   
  
  
  const { rows, fields } = await db.query(sql, [cityFrom, cityTo, date])

  const bus_lines = rows as (IBusLine & IBusLineStation)[];


  const toReturn = formatBusLines(bus_lines);

  return toReturn;
}


/**
 * Get all bus_lines.
 * 
 * @returns 
 */
async function getAll(): Promise<IBusLine[]> {

  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} ${JOIN_TABLES.COMPANY}
     JOIN bus_line_station bls ON bls.bus_line_id = bus_line.bus_line_id
     JOIN city ON bls.city_id = city.city_id
     WHERE bls.bus_line_station_type = 'POČETNO' OR
     bls.bus_line_station_type = 'KRAJNJE'
    `
  ));



  const bus_lines = rows as (IBusLine & IBusLineStation)[];


  const toReturn = formatBusLines(bus_lines);


  // for (const busLine of bus_lines) {

  //   busLine.stations = await loadStations(busLine.bus_line_id as number);
  // }

  return toReturn;
}


function formatBusLines(bus_lines: (IBusLine & IBusLineStation)[]) {
  const toReturn = [] as any[];


  for (let index = 0; index < bus_lines.length; index++) {
    const element = bus_lines[index];

    const indexInNewArray = toReturn.findIndex((tr: any) => tr.bus_line_id == element.bus_line_id);

    if (indexInNewArray == -1) {
      const newLength = toReturn.push(element);

      toReturn[newLength - 1][element.bus_line_station_type] = {
        city_name: element.city_name,
        arrives_at: element.arrives_at,
        bus_line_station_id: element.bus_line_station_id,
        city_id: element.city_id
      };
    } else {

      toReturn[indexInNewArray][element.bus_line_station_type] = {
        city_name: element.city_name,
        arrives_at: element.arrives_at,
        bus_line_station_id: element.bus_line_station_id,
        city_id: element.city_id
      };
    }

  }
  return toReturn;
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

/**
 * Update one busLine.
 * 
 * @param bus_line_id 
 * @param busLine 
 * @returns 
 */
async function update(bus_line_id: number, update: IBusLine) {
  const query = `Update ${TABLE} SET ${Object.keys(update).map(key => `${key} = ?`).join(", ")} WHERE bus_line_id = ?`;
  const parameters = [...Object.values(update), bus_line_id];
  const { rows, result } = await db.query(query, parameters);

  if (!result?.affectedRows) {

    return null;
  }

  return rows;
}


// Export default
export default {
  getByCityIds,
  getById,
  getAll,
  update,
  create
} as const;

import * as db from './database-connector';
import { getRandomInt } from '@shared/functions';
import { ITicket } from '../models/ticket-model';
import { IStation } from '../models/station';
import busLineStationRepo from './bus_line_station-repo';
import stationRepo from './station-repo';
import { IBusLine } from '../models/bus_line-model';
import { IBusLineStation } from '../models/bus_line_station-model';


const TABLE = 'ticket';

/**
 * Get one company.
 * 
 * @param email 
 * @returns 
 */
async function getById(ticket_id: number): Promise<ITicket | null> {
  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} WHERE ticket_id = ?`, [ticket_id]
  ));
  const company = rows[0] as ITicket;
  if (!company) null;
  return company;
}

/**
 * Get one ticket.
 * 
 * @param {ITicket} params 
 * @returns 
 */
async function create(params: ITicket): Promise<ITicket | null> {
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
 * Get all tickets.
 * 
 * @returns 
 */
async function getAll(): Promise<ITicket[]> {

  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE}`
  ));

  const tickets = rows as ITicket[];

  for (const ticket of tickets) {

    ticket.toStation = await loadBusStation(ticket.to_bus_line_station_id);
    ticket.fromStation = await loadBusStation(ticket.from_bus_line_station_id);

  }

  return tickets;
}

/**
 * Get all tickets on specified line.
 * 
 * @returns 
 */
async function getByBusLineId(buslineId: number, loadStations = false):
  Promise<(ITicket & IBusLine & IBusLineStation)[]> {

  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} 
    JOIN bus_line_station ON ticket.to_bus_line_station_id = bus_line_station.bus_line_station_id
    JOIN bus_line ON bus_line_station.bus_line_id = bus_line.bus_line_id
    WHERE ticket.bus_line_id = ${buslineId}
    ORDER BY arrives_at
    `
  ));

  const tickets = rows as (ITicket & IBusLine & IBusLineStation)[];

  if (loadStations)
    for (const ticket of tickets) {

      ticket.toStation = await loadBusStation(ticket.to_bus_line_station_id);
      ticket.fromStation = await loadBusStation(ticket.from_bus_line_station_id);

    }

  return tickets;
}

/**
 * Get all tickets on specified line.
 * 
 * @returns 
 */
async function getByUserId(userId: number, loadStations = false):
  Promise<(ITicket & IBusLine & IBusLineStation)[]> {

  const { rows, fields } = (await db.query(
    `SELECT * FROM ${TABLE} 
    JOIN bus_line_station ON ticket.to_bus_line_station_id = bus_line_station.bus_line_station_id
    JOIN bus_line ON bus_line_station.bus_line_id = bus_line.bus_line_id
    WHERE ticket.user_id = ${userId}
    ORDER BY arrives_at
    `
  ));

  const tickets = rows as (ITicket & IBusLine & IBusLineStation)[];

  if (loadStations)
    for (const ticket of tickets) {

      ticket.toStation = await loadBusStation(ticket.to_bus_line_station_id);
      ticket.fromStation = await loadBusStation(ticket.from_bus_line_station_id);

    }

  return tickets;
}

async function loadBusStation(bus_line_station_id: number):
  Promise<(IStation & { arrives_at: string, bus_line_station_type: string }) | null> {


  const busLineStation = await busLineStationRepo.getById(bus_line_station_id);


  if (!busLineStation) return null

  const station = {
    ...(await stationRepo.getById(busLineStation.station_id)),
    arrives_at: busLineStation.arrives_at,
    bus_line_station_type: busLineStation.bus_line_station_type

  };

  return station as IStation & { arrives_at: string, bus_line_station_type: string };
}


// Export default
export default {
  getByUserId,
  getByBusLineId,
  getAll,
  create
} as const;

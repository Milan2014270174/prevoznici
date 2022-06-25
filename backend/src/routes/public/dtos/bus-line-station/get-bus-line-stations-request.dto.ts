import { Request } from "express";

export interface IGetBusLineStationsRequest extends Request {

  body: {
    bus_line_id: number
  }
}
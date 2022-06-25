import { Request } from "express";
import { IBusLine } from "../../../../models/bus_line-model";
import { IBusLineStation } from "../../../../models/bus_line_station-model";

export interface ICreateBusLineRequestDto extends Request {

  body: {
    line: IBusLine;
    stations: IBusLineStation[];
  }
}
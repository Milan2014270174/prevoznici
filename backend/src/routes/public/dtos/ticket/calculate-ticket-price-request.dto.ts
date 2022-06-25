import { Request } from "express";
import { ITicket } from "../../../../models/ticket-model";

export interface ICalculateTicketPriceRequestDto extends Request {
  query: {
    from_bus_line_station_id: string
    to_bus_line_station_id: string
  }
}
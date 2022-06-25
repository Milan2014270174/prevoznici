import { Request } from "express";
import { ITicket } from "../../../../models/ticket-model";

export interface IUpdateTicketRequestDto extends Request {
  body: {
    ticket_id: number
    ticket: ITicket
  }
}
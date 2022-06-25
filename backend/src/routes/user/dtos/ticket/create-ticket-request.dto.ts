import { Request } from "express";
import { ITicket } from "../../../../models/ticket-model";

export interface ICreateTicketRequestDto extends Request {
  body: ITicket
}
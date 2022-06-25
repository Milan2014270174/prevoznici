import { Request } from "express";
import { ITicket } from "../../../../models/ticket-model";

export interface ICreateCompanyRequestDto extends Request {
  body: {
    company_name: string;
  }
}
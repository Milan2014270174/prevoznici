import { Request } from "express";

export interface IFilterBusLinesRequestDto extends Request {

  query: {
    company_id?: string
    cityTo: string
    cityFrom: string
    date: string
  }

}
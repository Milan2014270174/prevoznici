import { Request } from "express";

export interface ILoginUserRequestDto extends Request {
  body: {
    email: string
    password: string
  }
}
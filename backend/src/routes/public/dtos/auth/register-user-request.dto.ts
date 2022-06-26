import { Request } from "express";

export interface IRegisterUserRequestDto extends Request {
  body: {
    email: string
    password: string
    name: string
  }
}
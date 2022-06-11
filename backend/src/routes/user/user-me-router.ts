import StatusCodes from "http-status-codes"
import { Request, Response, Router } from "express"

import userService from "@services/user-service"
import { ParamMissingError } from "@shared/errors"

import jwtUtil from "../../util/jwt-util"
import { IUser } from "../../models/user-model"

// Constants
const router = Router()
const { CREATED, OK } = StatusCodes

// Paths
export const p = {
  getMe: "/me"
} as const

/**
 * Get all.
 */
router.get(p.getMe, async (req: Request, res: Response) => {
  // NEW CODE
  const jwt = req.headers.authorization?.substring(7, 9999) as string
  const clientData = (await jwtUtil.decode(jwt)) as IUser
  if (typeof clientData == "object") {
    return res.status(OK).json({ clientData })
  }

  // OLD CODE
  // const user = (await jwtUtil.decode(
  //   req.headers.authorization?.substring(7, 9999) as string
  // )) as IUser

  // const users = await userService.getByEmail(user)
  // return res.status(OK).json({ users })
})

// Export default
export default router

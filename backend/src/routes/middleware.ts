import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { cookieProps } from '@routes/auth-router';
import jwtUtil from '@util/jwt-util';


// Constants
const { UNAUTHORIZED } = StatusCodes;
const jwtNotPresentErr = 'JWT not present in signed cookie.';


/**
 * Middleware to verify if user is authenticated.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function userMw(req: Request, res: Response, next: NextFunction) {
  try {
    // Get json-web-token

    const jwt = req.headers.authorization?.substring(7, 9999);
    if (!jwt) {
      throw Error(jwtNotPresentErr);
    }
    // Make sure user role is an admin
    console.log(jwt);
    const clientData = await jwtUtil.decode(jwt);
    if (typeof clientData == 'object' && (clientData.role_id == 2 || clientData.role == 2)) {
      res.locals.sessionUser = clientData;
      next();
    } else {
      throw Error(jwtNotPresentErr);
    }
  } catch (err) {

    console.log(err);
    return res.status(UNAUTHORIZED).json({
      error: err.message,
    });
  }
};
/**
 * Middleware to verify if user is an admin.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function adminMw(req: Request, res: Response, next: NextFunction) {
  try {
    // Get json-web-token

    const jwt = req.headers.authorization?.substring(7, 9999);
    if (!jwt) {
      throw Error(jwtNotPresentErr);
    }
    // Make sure user role is an admin
    console.log(jwt);
    const clientData = await jwtUtil.decode(jwt);
    if (typeof clientData == 'object' && (clientData.role_id == 1 || clientData.role == 1)) {
      res.locals.sessionUser = clientData;
      next();
    } else {
      throw Error(jwtNotPresentErr);
    }
  } catch (err) {

    console.log(err);
    return res.status(UNAUTHORIZED).json({
      error: err.message,
    });
  }
};

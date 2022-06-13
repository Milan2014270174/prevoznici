import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import companyService from '@services/company-service';
import { ParamMissingError } from '@shared/errors';

import { body, validationResult } from 'express-validator';
import { ICompany } from '../../models/company-model';
import cityService from '../../services/city-service';




// Constants
const router = Router();
const { CREATED, OK, ACCEPTED } = StatusCodes;


// Paths
export const p = {
  get: '/all',
  add: '/add',
  update: '/update',
  delete: '/delete/:id',
} as const;



/**
 * Get all cities.
 */
router.get(p.get, async (_: Request, res: Response) => {
  const companys = await cityService.getAll();
  return res.status(OK).json({ companys });
});


// Export default
export default router;

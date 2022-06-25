import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import busLineService from '../../services/bus-line-service';
import { body, query, validationResult } from 'express-validator';

import { ParamMissingError } from '@shared/errors';
import { IFilterBusLinesRequestDto } from './dtos/bus-line/filter-bus-lines-request.dto';



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
  get: '/all',
  add: '/add',
  update: '/update',
  delete: '/delete/:id',
} as const;



/**
 * Get all busLines.
 */
router.get(p.get,
  query('company_id').optional(),
  query('cityTo').notEmpty().withMessage('Morate izabrati do kog grada.'),
  query('cityFrom').notEmpty().withMessage('Morate izabrati od kog grada.'),
  query('date').notEmpty().withMessage('Morate izabrati datum.'),
  async (req: IFilterBusLinesRequestDto, res: Response) => {

  let busLines = [] as any;
  if (req.query.cityFrom && req.query.cityTo && req.query.date) {

    const companyId = req.query.company_id;
    
    if (!companyId) {

      busLines = await busLineService.filterBusLines(
        parseInt(req.query.cityFrom.toString()), parseInt(req.query.cityTo.toString()), req.query.date.toString()
      )
    } else {
      busLines = await busLineService.filterBusLines(
        parseInt(req.query.cityFrom.toString()), parseInt(req.query.cityTo.toString()), req.query.date.toString(), parseInt(companyId.toString())
      )
    }
  } else {
    busLines = await busLineService.getAll();
  }

  return res.status(OK).json({ busLines });
});


// Export default
export default router;

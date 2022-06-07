import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import busLineStationService from '../../services/bus-line-station-service';
import { body, validationResult } from 'express-validator';

import { ParamMissingError } from '@shared/errors';
import { IBusLineStation } from '../../models/bus_line_station-model';



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



router.get(p.get,
  body('bus_line_id').isNumeric(),
  async (req: Request, res: Response) => {

    return res.status(OK).json({
      busLineStations: await busLineStationService.getByBusLineId(req.body.bus_line_id as number)
    })
  })




// Export default
export default router;

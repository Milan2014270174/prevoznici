import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import busLineStationService from '../../services/bus-line-station-service';
import { body, query, validationResult } from 'express-validator';

import { ParamMissingError } from '@shared/errors';
import { IBusLineStation } from '../../models/bus_line_station-model';
import { IGetBusLineStationsRequest } from './dtos/bus-line-station/get-bus-line-stations-request.dto';



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
  query('bus_line_id').notEmpty(),
  async (req: IGetBusLineStationsRequest, res: Response) => {

    return res.status(OK).json({
      busLineStations: await busLineStationService.getByBusLineId(req.query.bus_line_id as any)
    })
  })




// Export default
export default router;

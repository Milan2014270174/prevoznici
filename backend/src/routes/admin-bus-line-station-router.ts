import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import busLineStationService from '../services/bus-line-station-service';
import { body, validationResult } from 'express-validator';

import { ParamMissingError } from '@shared/errors';
import { IBusLineStation } from '../models/bus_line_station-model';



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

/**
 * Add one busLine.
 */
router.post(p.add,
  body('station_id').isNumeric().withMessage('Izaberite '),
  body('bus_line_id').isNumeric(),
  body('arrives_at')
    .custom((value: string) => new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).test(value)),
  body('bus_line_station_type').isIn(['IZMEĐU', 'POČETNO', 'KRAJNJE']),
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const busLine = req.body;

    // Check param
    if (!busLine) {
      throw new ParamMissingError();
    }
    // Fetch data
    const insertedBusLine = await busLineStationService.create(busLine as IBusLineStation);
    return res.status(CREATED).json({ busLineStation: insertedBusLine });
  });


// Export default
export default router;

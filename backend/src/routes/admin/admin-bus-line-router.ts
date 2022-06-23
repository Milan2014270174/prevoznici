import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import busLineService from '../../services/bus-line-service';
import { body, validationResult } from 'express-validator';

import { ParamMissingError } from '@shared/errors';



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
 * Add one busLine.
 */
router.post(p.add,
  body('line.bus_line_price').isNumeric(),
  body('line.driver_hash'),
  body('line.available_seats').isNumeric(),
  body('line.bus_register_number'),
  body('line.company_id').isNumeric().withMessage('Izaberite kompaniju.'),
  body('stations').isArray({ min: 2 }),
  body('stations.*.city_id').isNumeric().withMessage('Izaberite '),
  body('stations.*.arrives_at')
    .custom((value: string) => new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).test(value)),
  body('stations.*.bus_line_station_type').isIn(['IZMEĐU', 'POČETNO', 'KRAJNJE']),
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {line, stations} = req.body;
    console.log(line);
    // Check param
    if (!line) {
      throw new ParamMissingError();
    }
    // Fetch data
    const insertedBusLine = await busLineService.create(line, stations);
    return res.status(CREATED).json({ busLine: insertedBusLine, message: 'Uspešno dodata nova linija.' });
  });

/**
 * Update one busLine.
 */
router.put(p.update,
  body('line.bus_line_id').isNumeric().optional(),
  body('line.bus_line_price').isNumeric().optional(),
  body('line.reserved_date_at').isDate().optional(),
  body('line.driver_hash').optional(),
  body('line.available_seats').isNumeric().optional(),
  body('line.bus_register_number').optional(),
  body('line.company_id').isNumeric().withMessage('Izaberite kompaniju.'),
  body('stations').isArray(),
  body('stations.*.bus_line_station_id').isNumeric().withMessage('Nepostojeća stanica.').optional(),
  body('stations.*.city_id').isNumeric().withMessage('Nepostojeći grad.').optional(),
  body('stations.*.arrives_at')
    .custom((value: string) => new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).test(value)).optional(),
  body('stations.*.bus_line_station_type').isIn(['IZMEĐU', 'POČETNO', 'KRAJNJE']).optional(),
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {line, stations} = req.body;
    console.log(line);
    // Check param
    if (!line) {
      throw new ParamMissingError();
    }
    // Fetch data
    const insertedBusLine = await busLineService.updateOne(line, stations);
    return res.status(CREATED).json({ busLine: insertedBusLine, message: 'Uspešno izmenjena linija.' });
  });


// Export default
export default router;

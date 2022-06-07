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
  body('bus_line_price').isNumeric(),
  body('driver_hash'),
  body('available_seats').isNumeric(),
  body('bus_register_number'),
  body('company_id').isNumeric().withMessage('Izaberite kompaniju.'),
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const busLine = req.body;
    console.log(busLine);
    // Check param
    if (!busLine) {
      throw new ParamMissingError();
    }
    // Fetch data
    const insertedBusLine = await busLineService.create(busLine);
    return res.status(CREATED).json({ busLine: insertedBusLine });
  });


// Export default
export default router;

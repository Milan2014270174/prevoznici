import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import busLineService from '../../services/bus-line-service';
import { body, check, validationResult } from 'express-validator';

import { ParamMissingError } from '@shared/errors';
import ticketService from '../../services/ticket-service';
import { ITicket } from '../../models/ticket-model';
import jwtUtil from '../../util/jwt-util';
import { IUser } from '../../models/user-model';



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
 * Get all tickets.
 */
router.get(p.get, async (_: Request, res: Response) => {
  const tickets = await ticketService.getAll();
  return res.status(OK).json({ tickets });
});



/**
 * Add one busLine.
 */
router.post(p.add,
  body('reserved_for_date_at').isDate().isAfter(new Date().toISOString()),
  body('ticket_type').isIn(['POVRATNA', 'U JEDNOM SMERU']),
  body('passenger_name').isString(),
  body('is_paid').isBoolean().default(true).optional(),
  body('to_bus_line_station_id'),
  body('user_id'),
  body('from_bus_line_station_id')
    .if(body('to_bus_line_station_id').exists())
    .notEmpty()
    .custom((value, { req }) => value !== req.body.to_bus_line_station_id),
  body('roud_trip_ticket_id').if(body('ticket_type').equals('POVRATNA')).notEmpty(),
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ticket: ITicket = req.body;
    // Check param
    if (!ticket) {
      throw new ParamMissingError();
    }

    const insertedTicket = await ticketService.addOne(ticket);
    return res.status(CREATED).json({ ticket: insertedTicket });
  });


// Export default
export default router;

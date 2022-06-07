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
  get: '/my',
  add: '/add',
} as const;



/**
 * Get my tickets.
 */
router.get(p.get, async (req: Request, res: Response) => {

  const user =
    await jwtUtil.decode(req.headers.authorization?.substring(7, 9999) as string) as any;

  const tickets = await ticketService.getUsersTickets(user.id);
  return res.status(OK).json({ tickets });
});



/**
 * Reserve a ticket.
 */
router.post(p.add,
  body('reserved_for_date_at').isDate().isAfter(new Date().toISOString()),
  body('ticket_type').isIn(['POVRATNA', 'U JEDNOM SMERU']),
  body('passenger_name').isString(),
  body('is_paid').isBoolean().default(true).optional(),
  body('to_bus_line_station_id'),
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

    const user =
      await jwtUtil.decode(req.headers.authorization?.substring(7, 9999) as string) as any;

    ticket.user_id = user.id;

    const insertedTicket = await ticketService.addOne(ticket);
    return res.status(CREATED).json({ ticket: insertedTicket });
  });


// Export default
export default router;

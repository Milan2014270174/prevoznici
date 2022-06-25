import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import busLineService from '../../services/bus-line-service';
import { body, query, validationResult } from 'express-validator';

import { ParamMissingError } from '@shared/errors';
import ticketService from '../../services/ticket-service';
import { ICalculateTicketPriceRequestDto } from './dtos/ticket/calculate-ticket-price-request.dto';



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
  calculatePrice: '/calculate-price'
} as const;



/**
 * Get all busLines.
 */
router.get(p.calculatePrice,
  query('from_bus_line_station_id').notEmpty().withMessage('Morate izabrati do kog grada.'),
  query('to_bus_line_station_id').notEmpty().withMessage('Morate izabrati od kog grada.'),
  async (req: ICalculateTicketPriceRequestDto, res: Response) => {
    const price = await ticketService.createTicketDryRun(req.query);
    return res.status(OK).json({ price });
  });


// Export default
export default router;

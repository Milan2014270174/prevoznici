import StatusCodes from 'http-status-codes';
import { query, Request, Response, Router } from 'express';
import busLineService from '../../services/bus-line-service';
import { body, validationResult } from 'express-validator';

import { ParamMissingError } from '@shared/errors';
import ticketService from '../../services/ticket-service';



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
  async (req: Request, res: Response) => {
    const price = await ticketService.createTicketDryRun(req.query);
    return res.status(OK).json({ price });
  });


// Export default
export default router;

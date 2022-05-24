import { Router } from 'express';
import { adminMw } from './middleware';
import authRouter from './auth-router';
import userRouter from './user-router';
import adminRouter from './admin-router';
import busLineRouter from './admin-bus-line-router';
import busLineStationRouter from './admin-bus-line-station-router';
import adminCompanyRouter from './admin-company-router';
import adminTicketRouter from './admin-ticket-router';


// Init
const apiRouter = Router();

// Add api routes
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', adminMw, userRouter);
apiRouter.use('/companies', adminMw, adminCompanyRouter);

// Export default
export default apiRouter;

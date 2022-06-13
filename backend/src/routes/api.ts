import { Router } from 'express';
import { adminMw, userMw } from './middleware';
import authRouter from './auth-router';
import adminUserRouter from './admin/admin-user-router';
import adminBusLineRouter from './admin/admin-bus-line-router';
import adminBusLineStationRouter from './admin/admin-bus-line-station-router';
import adminCompanyRouter from './admin/admin-company-router';
import adminTicketRouter from './admin/admin-ticket-router';

import userTicketRouter from './user/user-ticket-router';
import userMeRouter from './user/user-me-router';

import busLineRouter from './public/bus-line-router';
import busLineStationRouter from './public/bus-line-station-router';
import companyRouter from './public/company-router';
import cityRouter from './public/cities-router';
import ticketRouter from './public/ticket-router';


// Init
const apiRouter = Router();

// Admin rute
apiRouter.use('/admin/users', adminMw, adminUserRouter);
apiRouter.use('/admin/bus-lines', adminMw, adminBusLineRouter);
apiRouter.use('/admin/bus-line-stations', adminMw, adminBusLineStationRouter);
apiRouter.use('/admin/companies', adminMw, adminCompanyRouter);
apiRouter.use('/admin/tickets', adminMw, adminTicketRouter);

// User rute
apiRouter.use('/user/tickets', userMw, userTicketRouter);
apiRouter.use('/user', userMw, userMeRouter);


// Public rute
apiRouter.use('/bus-lines', busLineRouter);
apiRouter.use('/tickets', ticketRouter);
apiRouter.use('/bus-line-stations', busLineStationRouter);
apiRouter.use('/companies', companyRouter);
apiRouter.use('/cities', cityRouter);
apiRouter.use('/auth', authRouter);

// Export default
export default apiRouter;

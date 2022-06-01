import { Router } from 'express';
import adminCompanyRouter from './admin-company-router'
const adminRouter = Router();
adminRouter.use('/company/', adminCompanyRouter );
export default adminRouter;
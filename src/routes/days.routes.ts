import { Router } from 'express';
import { getMonthDays, getDay } from '../controllers/days.controller';
// import * as authJwt from '../middlewares/authJwt';
const daysRouter = Router();

daysRouter.get('/', getDay);
daysRouter.get('/month', getMonthDays);
// daysRouter.get('/me', authJwt.verifyToken, getUserMonth);

export default daysRouter;

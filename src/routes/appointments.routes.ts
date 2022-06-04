import { Router } from 'express';
import {
  createNewAppointment,
  getAppointments,
  getAppointmentById,
  deleteAppointmentById,
} from '../controllers/appointments.controller';
import * as authJwt from '../middlewares/authJwt';
const appointmentsRouter = Router();

appointmentsRouter.get('/', [authJwt.verifyToken, authJwt.isSecretary], getAppointments);
appointmentsRouter.get('/:id', [authJwt.verifyToken, authJwt.isSecretary], getAppointmentById);
appointmentsRouter.post('/', authJwt.verifyToken, createNewAppointment);
appointmentsRouter.delete('/:id', [authJwt.verifyToken], deleteAppointmentById);

export default appointmentsRouter;

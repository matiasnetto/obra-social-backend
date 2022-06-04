import { Router } from 'express';
import { createNewDoctor, getAllDoctors, getDoctorById } from '../controllers/doctors.controller';
import { isAdmin, verifyToken } from '../middlewares/authJwt';

const doctorsRouter = Router();

doctorsRouter.get('/', getAllDoctors);
doctorsRouter.get('/:id', getDoctorById);
doctorsRouter.post('/', [verifyToken, isAdmin], createNewDoctor);

export default doctorsRouter;

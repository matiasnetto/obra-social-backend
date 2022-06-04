import { Request, Response, NextFunction } from 'express';
import { encryptPassword } from '../helpers/passwordsManagment';
import Doctor from '../models/DoctorModel';

export const createNewDoctor = async (req: Request, res: Response, next: NextFunction) => {
  const { username, name, password, specialty } = req.body;
  const passwordHash = await encryptPassword(password);

  try {
    const doctor = new Doctor({ username, name, passwordHash, specialty });

    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    // res.status(400).json(err);
    return next(err);
  }
};

export const getAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
  const { specialty } = req.query;
  try {
    let doctors;

    if (specialty) {
      doctors = await Doctor.find({ specialty });
    } else {
      doctors = await Doctor.find({});
    }

    if (!doctors) throw { name: 'InvalidParam', message: `Invali param: no doctor with specialty: ${specialty}` };

    res.status(200).json(doctors);
  } catch (err) {
    return next(err);
  }
};

export const getDoctorById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) throw { name: 'EmptyData', message: 'Doctor requested not found' };

    res.status(200).json(doctor);
  } catch (err) {
    return next(err);
  }
};

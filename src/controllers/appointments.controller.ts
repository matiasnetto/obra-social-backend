import { Response, NextFunction } from 'express';
import { IRequestWithUserId } from '../common/interfaces/Request.interface';
import cleanQueryParams from '../helpers/cleanQueryParams';
import Appointment from '../models/AppointmentModel';
import Day from '../models/DayModel';
import Doctor from '../models/DoctorModel';
import User from '../models/UserModel';
import { Types } from 'mongoose';
import formatDate from '../helpers/formatDate';

export const createNewAppointment = async (req: IRequestWithUserId, res: Response, next: NextFunction) => {
  const userId = req.id;
  const date: Date = new Date(req.body.date);
  const doctorId: string = req.body.doctor;
  const hour: string = req.body.hour;

  try {
    //validate doctor and user
    const [doctor, user] = await Promise.all([Doctor.findById(doctorId), User.findById(userId)]);
    if (!doctor) throw { name: 'ValidationError', message: 'Invalid doctor' };
    if (!user) throw { name: 'ValidationError', message: 'Invalid user' };

    //####################//
    // Create appointment //
    //####################//

    const appointment = new Appointment({
      date: formatDate(date),
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      hour: hour,
      client: user._id,
      doctor: doctor._id,
    });

    //Valdiate if hour is avaible
    const isHourAvaible = await Appointment.findOne({ date: formatDate(date), hour, doctor: doctor._id });
    if (isHourAvaible) throw { name: 'ValidationError', message: 'Validation error: hour is not avaible' };

    const newAppointment = await appointment.save();

    user.addApointment(newAppointment._id);
    await user.save();

    //######################//
    // Create or update Day //
    //######################//

    const day = await Day.findOne({ date: formatDate(date), doctor: doctor._id });

    if (!day) {
      //if the day didn't exists creates one
      const newDay = new Day({
        date: formatDate(date),
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        doctor: doctor._id,
      });

      newDay.disableHour(newAppointment.hour);

      await newDay.save();
    } else {
      //if the day exists updates the data
      day.disableHour(appointment.hour);
      await day.save();
    }

    res.status(201).json(newAppointment);
  } catch (err) {
    return next(err);
  }
};

export const getAppointments = async (req: IRequestWithUserId, res: Response, next: NextFunction) => {
  const querySearch = cleanQueryParams(req.query, ['date', 'month', 'doctor', 'year', 'client']);

  try {
    //Month validation
    if (querySearch.month) {
      const monthNumeber = Number(querySearch.month);
      if (isNaN(monthNumeber) || monthNumeber < 0 || monthNumeber > 12)
        throw { name: 'InvalidParam', message: 'Invalid param: Invalid month' };
    }

    //Year validation
    if (querySearch.year) {
      const yearNumber = Number(querySearch.year);
      if (isNaN(yearNumber)) throw { name: 'InvalidParam', message: 'Invalid param: Invalid year' };
    }

    //doctor validation
    if (querySearch.doctor) {
      const doctor = Doctor.findOne({ _id: querySearch.doctor });
      if (!doctor) throw { name: 'InvalidParam', message: 'Invalid param: Invalid doctor' };
    }

    //client validation
    if (querySearch.client) {
      const client = User.findOne({ _id: querySearch.client });
      if (!client) throw { name: 'InvalidParam', message: 'Invalid param: Invalid user' };
    }

    const appointments = await Appointment.find(querySearch);
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

export const getAppointmentById = async (req: IRequestWithUserId, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) throw { name: 'InvalidParam', message: 'Invalid param: Invalid user id' };

    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
};

export const deleteAppointmentById = async (req: IRequestWithUserId, res: Response, next: NextFunction) => {
  const userId = req.id;
  const appointmentId = req.params.id;

  try {
    const user = await User.findById(userId);
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment || !user) throw { name: 'ValidationError', message: 'Validation error: Invalid appointment' };

    //appointment.client is an ObjectId
    console.log((appointment.client as unknown as Types.ObjectId).toString() === userId);

    //Verify if the appointment client is the user that request the delete method, deny a user to delete another user's appointment
    if ((appointment.client as unknown as Types.ObjectId).toString() !== userId)
      throw { name: 'Unauthorized', message: 'Unauthorized: you do not have permission to delete this appointment' };

    appointment.date;

    //free the appointment hour
    const day = await Day.findOne({ date: appointment.date, doctor: appointment.doctor });
    day?.enableHour(appointment.hour);
    await day?.save();

    await appointment.delete();

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

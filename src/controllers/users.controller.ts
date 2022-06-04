import { NextFunction, Request, Response } from 'express';
import { encryptPassword } from '../helpers/passwordsManagment';
import User from '../models/UserModel';
import jwt from 'jsonwebtoken';
import { IRequestWithUserId } from '../common/interfaces/Request.interface';
import Appointment from '../models/AppointmentModel';
import Day from '../models/DayModel';
import { isAfter } from 'date-fns';

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, name, surname, password } = req.body;

  const passwordHash = await encryptPassword(password);

  try {
    //validate if a user with the same username exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      throw { name: 'ValidationError', message: 'ValidationError: Username already exists' };
    }

    //create new user
    const user = new User({ username, email, name, surname, passwordHash, role: 'client' });
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (err) {
    return next(err);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  console.log({ username, password });

  try {
    if (!username || !password)
      throw { name: 'ValidationError', message: 'ValidationError: invalid username or password' };

    const user = await User.findOne({ username });

    if (!user) throw { name: 'ValidationError', message: 'ValidationError: invalid username or password' };

    const isValidPassword = await User.comparePasswords(password, user.passwordHash);

    if (!isValidPassword) throw { name: 'ValidationError', message: 'ValidationError: invalid username or password' };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);

    res.status(202).json({ token: `Bearer ${token}` });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  const appointments = Boolean(req.query.appointments) || false;

  try {
    if (!username) throw { name: 'InvalidParam', message: 'Invalid param: you need to provide a username' };
    if (typeof appointments !== 'boolean')
      throw { name: 'InvalidParam', message: 'Invalid param: appointments need to be true or false' };

    let user;

    if (appointments) {
      // if appointments is true return the user with appointments populated
      user = await User.findOne({ username })
        .populate({ path: 'appointments', populate: { path: 'doctor' } })
        .exec();
    } else {
      // if appointments is false return the user
      user = await User.findOne({ username });
    }

    if (!user) throw { name: 'ValidationError', message: 'ValidationError: invalid user' };

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getMyUser = async (req: IRequestWithUserId, res: Response, next: NextFunction) => {
  const appointments = Boolean(req.query.appointments) || false;

  try {
    let user;
    if (appointments) {
      // if appointments is true return the user with appointments populated
      user = await User.findById(req.id)
        .populate({ path: 'appointments', populate: { path: 'doctor' } })
        .exec();
    } else {
      // if appointments is false return the user
      user = await User.findById(req.id);
    }

    if (!user) throw { name: 'ValidationError', message: 'ValidationError: invalid user' };

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
  // req.params = {username: req.id}
};

export const deleteUserById = async (req: IRequestWithUserId, res: Response, next: NextFunction) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) throw { name: 'ValidationError', message: 'Validation error: invalid user' };

    //get all the appointments of the user to delete
    const appointments = await Appointment.find({ client: user._id });

    //map the appointments into delete appointment promises
    const deleteAppointmentsPromises = appointments.map((el) => el.delete());
    await Promise.all(deleteAppointmentsPromises); //delete the appointments

    //map the days occuped
    const daysOcupped = appointments
      .map((el) => ({ date: el.date, doctor: el.doctor, hour: el.hour }))
      .filter((el) => isAfter(new Date(el.date), new Date()) && el);

    //map the days and enable the disabled days
    for (let i = 0; i < daysOcupped.length; i++) {
      const day = await Day.findOne({ date: daysOcupped[i].date, doctor: daysOcupped[i].doctor });

      if (!day) return;

      day.enableHour(daysOcupped[i].hour);
      await Day.findOneAndUpdate({ _id: day._id }, { hours: day.hours });
    }

    //delete user
    await user.delete();

    res.send(200).end();
  } catch (err) {
    next(err);
  }
};

export const deleteMyUser = async (req: IRequestWithUserId, res: Response, next: NextFunction) => {
  const userId = req.id;

  try {
    const user = await User.findById(userId);

    if (!user) throw { name: 'ValidationError', message: 'Validation error: invalid user' };

    //get all the appointments of the user to delete
    const appointments = await Appointment.find({ client: user._id });

    //map the appointments into delete appointment promises
    const deleteAppointmentsPromises = appointments.map((el) => el.delete());
    await Promise.all(deleteAppointmentsPromises);

    //map the days occuped
    const daysOcupped = appointments
      .map((el) => ({ date: el.date, doctor: el.doctor, hour: el.hour }))
      .filter((el) => isAfter(new Date(el.date), new Date()) && el);

    for (let i = 0; i < daysOcupped.length; i++) {
      const day = await Day.findOne({ date: daysOcupped[i].date, doctor: daysOcupped[i].doctor });

      if (!day) return;

      day.enableHour(daysOcupped[i].hour);
      await Day.findOneAndUpdate({ _id: day._id }, { hours: day.hours });
    }

    //delete user
    await user.delete();

    res.send(200).end();
  } catch (err) {
    next(err);
  }
};

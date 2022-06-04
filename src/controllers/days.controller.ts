import { endOfMonth, addDays } from 'date-fns';
import { Request, Response, NextFunction } from 'express';
import { IDay } from '../common/interfaces/controllers/daysController.interface';
import { IHour } from '../common/interfaces/models/DaysModel.interface';
import formatDate from '../helpers/formatDate';
import Day from '../models/DayModel';
import Doctor from '../models/DoctorModel';

const defAvaibleHours: IHour[] = [
  { hour: '9:00', avaible: true },
  { hour: '10:00', avaible: true },
  { hour: '11:00', avaible: true },
  { hour: '12:00', avaible: true },
  { hour: '13:00', avaible: true },
  { hour: '14:00', avaible: true },
  { hour: '15:00', avaible: true },
  { hour: '16:00', avaible: true },
];

const defDisableHours: IHour[] = [
  { hour: '9:00', avaible: false },
  { hour: '10:00', avaible: false },
  { hour: '11:00', avaible: false },
  { hour: '12:00', avaible: false },
  { hour: '13:00', avaible: false },
  { hour: '14:00', avaible: false },
  { hour: '15:00', avaible: false },
  { hour: '16:00', avaible: false },
];

const genMonthDays = (date: Date): IDay[] => {
  const today = new Date();
  const days = [];
  for (let i = 0; i <= endOfMonth(date).getDate(); i++) {
    const dayDate = addDays(date, i);
    const dayAvaible = dayDate < today ? false : true; //if the date is in the past, the day is not avaible
    const hours = dayDate < today ? defDisableHours : defAvaibleHours; //if the date is in the past all the hours are disabled

    const dayObject = {
      date: formatDate(dayDate),
      day: dayDate.getDate(),
      weekDay: dayDate.getDay(),
      hours,
      dayAvaible,
    };
    days.push(dayObject);
  }
  return days;
};

export const getDay = async (req: Request, res: Response, next: NextFunction) => {
  const date = new Date(String(req.query.date));
  const doctorId = req.query.doctor;

  // validate date
  if (date.toString() === 'Invalid Date') throw { name: 'ValidationError', message: 'Validation error: invalid date' };

  try {
    // validate doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw { name: 'ValidationError', message: 'Validation error: invalid doctor' };

    const databaseDay = await Day.findOne({
      date: formatDate(date),
      doctor: doctor._id,
    });

    if (!databaseDay) {
      // if day did not exists on database

      const today = new Date();
      const dayAvaible = date < today ? false : true; //if the date is in the past, the day is not avaible
      const hours = date < today ? defDisableHours : defAvaibleHours; //if the date is in the past all the hours are disabled
      const returnDay: IDay = {
        date: formatDate(date),
        day: date.getDate(),
        weekDay: date.getDay(),
        dayAvaible,
        hours,
      };

      res.status(200).json(returnDay);
    } else {
      // if day exists on te databas

      const returnDay: IDay = {
        date: formatDate(date),
        day: date.getDate(),
        weekDay: date.getDay(),
        dayAvaible: databaseDay.dayAvaible,
        hours: databaseDay.hours,
      };

      res.status(200).json(returnDay);
    }
  } catch (err) {
    next(err);
  }
};

export const getMonthDays = async (req: Request, res: Response, next: NextFunction) => {
  const today = new Date();
  const month = Number(req.query.month);
  const year = Number(req.query.year) || today.getFullYear();
  console.log(year);
  const doctorId = req.query.doctor;
  const date = new Date(year, month, 1);
  const monthDays: IDay[] = genMonthDays(date);

  //validate month and year
  if (isNaN(month) || isNaN(year))
    throw { name: 'ValidationError', message: 'Validation error: invalid month or year' };

  try {
    //validate doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw { name: 'ValidationError', message: 'Validation error: invalid doctor' };

    const databaseDays = await Day.find({ month, year, doctor });

    // add database data to monthDays
    databaseDays.forEach((databaseDay) => {
      const index = monthDays.findIndex((el) => el.day === databaseDay.day);
      // if the day is avaible it means that the day is in the future, and not in the past
      if (monthDays[index].dayAvaible === true) {
        monthDays[index] = { ...monthDays[index], hours: databaseDay.hours, dayAvaible: databaseDay.dayAvaible };
      }
    });

    res.status(200).json(monthDays);
  } catch (err) {
    next(err);
  }
};

// export const getUserMonth = async (req: IRequestWithUserId, res: Response, next: NextFunction) => {
//   try {
//     const today = new Date();
//     const month = Number(req.query.month) || today.getMonth();
//     const year = Number(req.query.year) || today.getFullYear();

//     // validate month and year
//     if (isNaN(month) || isNaN(month))
//       throw { name: 'ValidationError', message: 'Validation error: Invalid month or year' };

//     const user = await User.findById(req.id, { appointments: 1 })
//       .populate({ path: 'appointments', populate: { path: 'doctor' } })
//       .exec();
//     const userAppointments = user?.appointments as unknown as IAppointmentDocument[];

//     const date = new Date(year, month);
//     const monthDays: IDay[] = genMonthDays(date);

//     userAppointments.forEach((userAppointment) => {
//       const index = monthDays.findIndex((el) => el.date === userAppointment.date);

//       if (index !== -1){
//         monthDays[index] =
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

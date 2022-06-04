import { IHour } from '../models/DaysModel.interface';

export interface IDay {
  date: string;
  day: number;
  weekDay: number;
  hours: IHour[];
  dayAvaible: boolean;
}

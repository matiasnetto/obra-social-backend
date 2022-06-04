import { Schema, Types, Model } from 'mongoose';

export interface IAppointmentDocument {
  date: string;
  day: number;
  month: number;
  year: number;
  hour: string;
  client: Schema.Types.ObjectId;
  doctor: Schema.Types.ObjectId;
}

export type IAppointmentModel = Model<IAppointmentDocument>;

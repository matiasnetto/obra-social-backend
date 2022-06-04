import { Schema, Model } from 'mongoose';

export interface IHour {
  hour: string;
  avaible: boolean;
}

export interface IDayDocument {
  date: string;
  day: number;
  month: number;
  year: number;
  hours: IHour[];
  dayAvaible: boolean;
  doctor: Schema.Types.ObjectId;
}

export interface IDayMethods extends IDayDocument {
  calculateAvaibleDay: () => boolean;
  disableHour: (hour: string) => void;
  enableHour: (hour: string) => void;
}
export type IDayModel = Model<IDayDocument, Record<string, unknown>, IDayMethods>;

// export interface IDayModel extends Model<IDay, {},> {
//   disableHour: (hour: string) => void;
// }

// export default IDay;

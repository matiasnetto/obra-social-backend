import { Schema, model } from 'mongoose';
import { IDayDocument, IHour, IDayMethods, IDayModel } from '../common/interfaces/models/DaysModel.interface';

const defaultHours: IHour[] = [
  { hour: '9:00', avaible: true },
  { hour: '10:00', avaible: true },
  { hour: '11:00', avaible: true },
  { hour: '12:00', avaible: true },
  { hour: '13:00', avaible: true },
  { hour: '14:00', avaible: true },
  { hour: '15:00', avaible: true },
  { hour: '16:00', avaible: true },
];

const daySchema: Schema<IDayDocument, IDayModel, IDayMethods> = new Schema({
  date: { type: String, required: true },
  day: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  hours: { type: [{ hour: String, avaible: Boolean }], default: defaultHours },
  dayAvaible: { type: Boolean, default: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
});

daySchema.methods.calculateAvaibleDay = function (): boolean {
  if (this.hours.every((el) => !el.avaible)) return false;
  else return true;
};

daySchema.methods.disableHour = function (hour: string) {
  this.hours = this.hours.map((h) => {
    if (h.hour === hour) return { hour, avaible: false };

    return h;
  });

  this.dayAvaible = this.calculateAvaibleDay(); //recalculate day avaible
};

daySchema.methods.enableHour = function (hour: string) {
  this.hours = this.hours.map((h) => {
    if (h.hour === hour) return { hour, avaible: true };

    return h;
  });

  this.dayAvaible = this.calculateAvaibleDay(); //recalculate day avaible
};

const Day: IDayModel = model<IDayDocument, IDayModel, IDayMethods>('Day', daySchema);

export default Day;

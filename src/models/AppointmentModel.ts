import { Schema, model, Types } from 'mongoose';
import { IAppointmentDocument, IAppointmentModel } from '../common/interfaces/models/AppointmentModel.interface';

const appointmentSchema: Schema<IAppointmentDocument, IAppointmentModel> = new Schema({
  date: {
    type: String,
    required: true,
  },
  day: Number,
  month: Number,
  year: Number,
  hour: String,
  client: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
});

appointmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;

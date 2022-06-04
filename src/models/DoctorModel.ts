import { Schema, model } from 'mongoose';
import { IDoctorModel } from '../common/interfaces/models/DoctorModel.interface';

const doctorSchema: Schema<IDoctorModel> = new Schema({
  username: {
    type: String,
    required: true,
    maxlength: 30,
  },
  name: {
    type: String,
    required: true,
    maxlength: 40,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
});

doctorSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  },
});

const Doctor = model<IDoctorModel>('Doctor', doctorSchema);

export default Doctor;

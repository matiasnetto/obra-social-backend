import { Schema, Types, model } from 'mongoose';
import { IUserDocument, IUserMethos, IUserModel } from '../common/interfaces/models/UserModel.interface';
import bcrypt from 'bcrypt';

const userSchema: Schema<IUserDocument, IUserModel, IUserMethos> = new Schema({
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
  surname: {
    type: String,
    required: true,
    maxlength: 40,
  },
  email: {
    type: String,
    required: true,
    maxlength: 40,
    validate: {
      validator: (email: string) => email.split('').some((el) => el === '@'),
      message: 'Invalid email',
    },
  },
  role: {
    type: String,
    required: true,
    validate: {
      validator: (role: string) => role === 'client' || role === 'secretary' || role === 'admin',
      message: 'Invalid role name',
    },
    default: 'client',
  },
  passwordHash: {
    type: String,
    required: true,
  },
  appointments: {
    type: [Types.ObjectId],
    ref: 'Appointment',
    default: [],
  },
});

userSchema.statics.hashPassword = async function (password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

userSchema.statics.comparePasswords = async function (password: string, passwordHash: string): Promise<boolean> {
  try {
    const result = await bcrypt.compare(password, passwordHash);
    return result;
  } catch (err) {
    return false;
  }
};

userSchema.methods.addApointment = function (appointment: Types.ObjectId) {
  this.appointments.push(appointment);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  },
});

const User: IUserModel = model<IUserDocument, IUserModel, IUserMethos>('User', userSchema);

export default User;

import { Types, Model } from 'mongoose';

export interface IUserDocument {
  username: string;
  name: string;
  surname: string;
  email: string;
  // image:string;
  role: string;
  passwordHash: string;
  appointments: Types.ObjectId[];
}

// export interface IUserMethods extends IUser {}
export interface IUserMethos extends IUserDocument {
  addApointment: (appointment: Types.ObjectId) => void;
}

export interface IUserModel extends Model<IUserDocument, Record<string, unknown>, IUserMethos> {
  encryptPassword: (password: string) => Promise<string>;
  comparePasswords: (password: string, passwordHash: string) => Promise<boolean>;
}

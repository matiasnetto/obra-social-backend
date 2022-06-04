import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IDecodedToken } from '../common/interfaces/middlewares/authJwt.interface';
import { IRequestWithUserId } from '../common/interfaces/Request.interface';
import User from '../models/UserModel';

export const verifyToken = (req: IRequestWithUserId, res: Response, next: NextFunction) => {
  const token = req.get('authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized: no token provided' });

  try {
    const decodedToken: IDecodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as IDecodedToken;
    req.id = decodedToken.id;
  } catch (err) {
    next(err);
  }
  next();
};

export const isSecretary = async (req: IRequestWithUserId, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.id);

    if (!user) throw { name: 'ValidationError', message: 'Validation error: Invalid user' };

    if (user.role === 'client')
      throw { name: 'Unauthorized', message: 'Unauthorized: your user does not have acces to this resource' };

    next();
  } catch (err) {
    next(err);
  }
};

export const isAdmin = async (req: IRequestWithUserId, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.id);

    if (!user) throw { name: 'ValidationError', message: 'Validation error: Invalid user' };

    if (user.role === 'client' || user.role === 'secretary')
      throw { name: 'Unauthorized', message: 'Unauthorized: your user does not have acces to this resource' };

    next();
  } catch (err) {
    next(err);
  }
};

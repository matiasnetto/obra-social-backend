/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

const ERROR_HANDLERS = {
  ValidationError: (res: Response, err: any) => {
    res.status(406).json({ message: err.message });
  },

  EmptyData: (res: Response, err: any) => {
    res.status(404).json({ message: err.message });
  },

  MissingParams: (res: Response, err: any) => {
    res.status(400).json({ message: err.message });
  },

  InvalidParam: (res: Response, err: any) => {
    res.status(400).json({ message: err.message });
  },

  CastError: (res: Response) => {
    res.status(400).json({ message: 'Invalid id requested' });
  },

  JsonWebTokenError: (res: Response, err: any) => {
    res.status(401).json({ message: err.message });
  },

  Unauthorized: (res: Response, err: any) => {
    res.status(401).json({ message: err.message });
  },

  defaultError: (res: Response, err: any) => {
    res.status(400).json(err);
  },
};

const handleErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const handler = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError;
  console.log(err);
  handler(res, err);
};

export default handleErrors;

import mongoose from 'mongoose';
import process from 'process';

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('DB connected!');
  })
  .catch((err) => {
    console.log(err);
  });

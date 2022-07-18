import express from 'express';
import handleErrors from '../middlewares/handleErrors';
import appointmentsRouter from '../routes/appointments.routes';
import daysRouter from '../routes/days.routes';
import doctorsRouter from '../routes/doctors.routes';
import usersRouter from '../routes/users.routes';
import cors from 'cors';
import { readFileSync } from 'fs';
// import path from 'path'

//Swagger
import swaggerUI from 'swagger-ui-express';
import path from 'path';
const swaggerDocument = readFileSync(path.join(__dirname, '../swagger.json'), 'utf-8');

//App
const app = express();
app.set('PORT', process.env.PORT || 5001);
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, '../../public')));
app.use('/api/doctors', doctorsRouter);
app.use('/api/users', usersRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/days', daysRouter);
app.use('/api', swaggerUI.serve, swaggerUI.setup(JSON.parse(swaggerDocument)));

app.use(handleErrors);

// app.use((req,res,next)=>{

// })

export default app;

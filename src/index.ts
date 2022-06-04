import dotenv from 'dotenv';
dotenv.config();
import './config/mongo';
import app from './config/server';

app.listen(app.get('PORT'), '192.168.1.62', () => {
  console.log('Server listening on  port' + app.get('PORT'));
});

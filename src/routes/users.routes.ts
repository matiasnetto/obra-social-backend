import { Router } from 'express';
import {
  createNewUser,
  loginUser,
  getUserById,
  getMyUser,
  deleteUserById,
  deleteMyUser,
} from '../controllers/users.controller';
import { isSecretary, verifyToken } from '../middlewares/authJwt';
const usersRouter = Router();

usersRouter.get('/me', verifyToken, getMyUser);
usersRouter.delete('/me', [verifyToken], deleteMyUser);
usersRouter.get('/:username', [verifyToken, isSecretary], getUserById);
usersRouter.post('/', createNewUser);
usersRouter.post('/login', loginUser);
usersRouter.delete('/:id', [verifyToken, isSecretary], deleteUserById);

export default usersRouter;

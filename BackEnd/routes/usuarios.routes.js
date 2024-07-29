import { Router } from 'express';
import {
  getUsers,
  getUserByDni,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/usuarios.controller.js';

const router = Router();

//router.get('/api/users', getUsers);

router.get('/api/users/:dni', getUserByDni);

router.post('/api/users', createUser);

router.put('/api/users/:dni', updateUser);

router.delete('/api/users/:dni', deleteUser);

export default router;

import { Router } from 'express';
import {
  getUsers,
  getUserByDni,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/usuarios.controller.js';

const router = Router();

router.get('/users', getUsers);

router.get('/users/:dni', getUserByDni);

router.post('/users', createUser);

router.put('/users/:dni', updateUser);

router.delete('/users/:dni', deleteUser);

export default router;

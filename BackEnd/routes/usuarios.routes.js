import { Router } from 'express';
import { Paciente } from '../middleware/authorizeRole.js';
import {
  getUsers,
  getUserByDniFecha,
  createUser,
  updateUser,
  deleteUser,
  getUserByDni
} from '../controllers/usuarios.controller.js';

const router = Router();

router.post('/api/usersdni', Paciente, getUserByDni);

router.post('/api/usersdnifecha', getUserByDniFecha);

router.get('/api/userstodos', Paciente, getUsers);

router.post('/api/users', createUser);

router.put('/api/users/', Paciente, updateUser);

router.delete('/api/users/', deleteUser);

export default router;

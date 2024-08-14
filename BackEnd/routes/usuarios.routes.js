import { Router } from 'express';
import {
  getUsers,
  getUserByDniFecha,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/usuarios.controller.js';

const router = Router();


router.post('/api/usersdnifecha', getUserByDniFecha);

router.get('/api/userstodos', getUsers);

router.post('/api/users', createUser);

router.put('/api/users/', updateUser);

router.delete('/api/users/', deleteUser);

export default router;

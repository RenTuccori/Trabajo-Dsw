import { Router } from 'express';
import { Patient, AdminOrPatient } from '../middleware/authorizeRole.js';
import {
  getUsers,
  getUserByDniFecha,
  createUser,
  updateUser,
  deleteUser,
  getUserByDni,
} from '../controllers/usuarios.controllers.js';
import { validateUserDni, validateUserLogin, validateCreateUser, validateUpdateUser, validateDniParam } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/usersdni', Patient, validateUserDni, validate, getUserByDni);

router.post('/api/usersdnifecha', validateUserLogin, validate, getUserByDniFecha);

router.get('/api/userstodos', Patient, getUsers);

router.post('/api/users', validateCreateUser, validate, createUser);

router.put('/api/users/', AdminOrPatient, validateUpdateUser, validate, updateUser);

router.delete('/api/users/:dni', AdminOrPatient, validateDniParam, validate, deleteUser);

export default router;

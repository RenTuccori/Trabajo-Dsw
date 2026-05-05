import { Router } from 'express';
import { Patient, AdminOrPatient } from '../middleware/authorizeRole.js';
import {
  getUsers,
  getUserByNationalIdPassword,
  createUser,
  updateUser,
  deleteUser,
  getUserByNationalId,
} from '../controllers/users.controllers.js';
import { validateUserNationalId, validateUserLogin, validateCreateUser, validateUpdateUser, validateNationalIdParam } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/users/nationalId', AdminOrPatient, validateUserNationalId, validate, getUserByNationalId);

router.post('/api/users/login', validateUserLogin, validate, getUserByNationalIdPassword);

router.get('/api/users/all', Patient, getUsers);

router.post('/api/users', validateCreateUser, validate, createUser);

router.put('/api/users', AdminOrPatient, validateUpdateUser, validate, updateUser);

router.delete('/api/users/:nationalId', AdminOrPatient, validateNationalIdParam, validate, deleteUser);

export default router;

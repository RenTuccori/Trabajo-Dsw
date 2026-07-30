import { Router } from 'express';
import { Admin, AdminOrPatient } from '../middleware/authorizeRole.js';
import { authorizeOwnerOrAdmin } from '../middleware/authorizeOwnerOrAdmin.js';
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

const ownerByBodyId = authorizeOwnerOrAdmin((req) => req.body.nationalId);
const ownerByParamId = authorizeOwnerOrAdmin((req) => req.params.nationalId);

router.post('/api/users/nationalId', ownerByBodyId, validateUserNationalId, validate, getUserByNationalId);

router.post('/api/users/login', validateUserLogin, validate, getUserByNationalIdPassword);

router.get('/api/users/all', Admin, getUsers);

router.post('/api/users', validateCreateUser, validate, createUser);

router.put('/api/users', ownerByBodyId, validateUpdateUser, validate, updateUser);

router.delete('/api/users/:nationalId', Admin, validateNationalIdParam, validate, deleteUser);

export default router;


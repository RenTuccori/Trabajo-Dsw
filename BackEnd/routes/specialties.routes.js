import { Router } from 'express';
import {
  getSpecialties,
  getAvailableSpecialties,
  getSpecialtyById,
  getAllSpecialties,
} from '../controllers/specialties.controllers.js';
import { Patient } from '../middleware/authorizeRole.js';
import { validateSpecialtyId, validateLocationIdBody } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/specialties', Patient, validateLocationIdBody, validate, getSpecialties);

router.post('/api/specialties/all', getAllSpecialties);

router.post('/api/specialties/available', Patient, validateLocationIdBody, validate, getAvailableSpecialties);

router.get('/api/specialties/:id', Patient, validateSpecialtyId, validate, getSpecialtyById);

export default router;

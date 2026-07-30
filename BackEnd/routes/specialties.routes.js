import { Router } from 'express';
import {
  getSpecialties,
  getAvailableSpecialties,
  getSpecialtyById,
  getAllSpecialties,
} from '../controllers/specialties.controllers.js';
import { AdminOrPatient, AnyRole } from '../middleware/authorizeRole.js';
import { validateSpecialtyId, validateLocationIdBody } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/specialties', AdminOrPatient, validateLocationIdBody, validate, getSpecialties);

router.post('/api/specialties/all', AnyRole, getAllSpecialties);

router.post('/api/specialties/available', AdminOrPatient, validateLocationIdBody, validate, getAvailableSpecialties);

router.get('/api/specialties/:id', AdminOrPatient, validateSpecialtyId, validate, getSpecialtyById);

export default router;


import { Router } from 'express';
import {
  getSpecialties,
  getAvailableSpecialties,
  getSpecialtyById,
  getAllSpecialties,
} from '../controllers/especialidades.controllers.js';
import { Patient } from '../middleware/authorizeRole.js';
import { validateSpecialtyId, validateLocationIdBody } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/allspecialties', Patient, validateLocationIdBody, validate, getSpecialties);

router.post('/api/allespecialties', getAllSpecialties);

router.post('/api/availablespecialties', Patient, validateLocationIdBody, validate, getAvailableSpecialties);

router.get('/api/idspecialties/:idEspecialidad', Patient, validateSpecialtyId, validate, getSpecialtyById);

export default router;

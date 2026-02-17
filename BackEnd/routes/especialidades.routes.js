import { Router } from 'express';
import {
  getSpecialties,
  getAvailableSpecialties,
  getSpecialtyById,
  getAllSpecialities,
} from '../controllers/especialidades.controllers.js';
import { Patient } from '../middleware/authorizeRole.js';
import { validateEspecialidadId, validateSedeIdBody } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/allspecialties', Patient, validateSedeIdBody, validate, getSpecialties);

router.post('/api/allespecialties', getAllSpecialities);

router.post('/api/availablespecialties', Patient, validateSedeIdBody, validate, getAvailableSpecialties);

router.get('/api/idspecialties/:idEspecialidad', Patient, validateEspecialidadId, validate, getSpecialtyById);

export default router;

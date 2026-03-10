import { Router } from 'express';
import {
  getPatients,
  getPatientByNationalId,
  createPatient,
} from '../controllers/patients.controllers.js';
import { Patient, DoctorOrPatient } from '../middleware/authorizeRole.js';
import { validateCreatePatient, validateUserNationalId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/api/patients', DoctorOrPatient, getPatients);

router.post('/api/patients/nationalId', Patient, validateUserNationalId, validate, getPatientByNationalId);

router.post('/api/patients', validateCreatePatient, validate, createPatient);

export default router;

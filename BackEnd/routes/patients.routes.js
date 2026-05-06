import { Router } from 'express';
import {
  getPatients,
  getPatientByNationalId,
  createPatient,
  deletePatient,
} from '../controllers/patients.controllers.js';
import { Patient, DoctorOrPatient, Admin, AnyRole } from '../middleware/authorizeRole.js';
import { validateCreatePatient, validateUserNationalId, validateNationalIdParam } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/api/patients', AnyRole, getPatients);

router.post('/api/patients/nationalId', AnyRole, validateUserNationalId, validate, getPatientByNationalId);

router.post('/api/patients', AnyRole, validateCreatePatient, validate, createPatient);

router.delete('/api/patients/:nationalId', Admin, validateNationalIdParam, validate, deletePatient);

export default router;

import { Router } from 'express';
import {
  getPatients,
  getPatientByDni,
  createPatient,
} from '../controllers/pacientes.controllers.js';
import { Patient, DoctorOrPatient } from '../middleware/authorizeRole.js';
import { validateCreatePatient, validateUserDni } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/api/patient', DoctorOrPatient, getPatients);

router.post('/api/patientdni', Patient, validateUserDni, validate, getPatientByDni);

router.post('/api/patientcreate', validateCreatePatient, validate, createPatient);

export default router;

import { Router } from 'express';
import {
  getPacientes,
  getPacienteByDni,
  createPaciente,
} from '../controllers/pacientes.controllers.js';
import { Patient, DoctorOrPatient } from '../middleware/authorizeRole.js';
import { validateCreatePaciente, validateUserDni } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/api/patient', DoctorOrPatient, getPacientes);

router.post('/api/patientdni', Patient, validateUserDni, validate, getPacienteByDni);

router.post('/api/patientcreate', validateCreatePaciente, validate, createPaciente);

export default router;

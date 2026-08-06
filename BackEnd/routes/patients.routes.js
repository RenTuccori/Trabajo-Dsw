import { Router } from 'express';
import {
  getPatients,
  getPatientByNationalId,
  createPatient,
  deletePatient,
} from '../controllers/patients.controllers.js';
import { Patient, DoctorOrAdmin, Admin, AnyRole } from '../middleware/authorizeRole.js';
import { authorizePatientOwnerOrStaff } from '../middleware/authorizeOwnerOrAdmin.js';
import { validateCreatePatient, validateUserNationalId, validateNationalIdParam } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const patientOwnerOrStaffByBodyId = authorizePatientOwnerOrStaff((req) => req.body.nationalId);

router.get('/api/patients', DoctorOrAdmin, getPatients);

router.post('/api/patients/nationalId', patientOwnerOrStaffByBodyId, validateUserNationalId, validate, getPatientByNationalId);

router.post('/api/patients', AnyRole, validateCreatePatient, validate, createPatient);

router.delete('/api/patients/:nationalId', Admin, validateNationalIdParam, validate, deletePatient);

export default router;


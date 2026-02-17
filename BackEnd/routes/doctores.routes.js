import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  getDoctorByDniContra,
  getDoctorById,
  getDoctores,
  getAvailableDoctors,
} from '../controllers/doctores.controllers.js';
import { AdminOrPatient, Patient, Admin, Doctor } from '../middleware/authorizeRole.js';
import { validateDoctorLogin, validateDoctorId, validateSedeEspBody, validateSedeIdBody, validateUserDni } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/doctors', Patient, validateSedeEspBody, validate, getDoctors);

router.post('/api/availabledoctors', Patient, validateSedeIdBody, validate, getAvailableDoctors);

router.post('/api/alldoctors', Admin, getDoctores);

router.post('/api/doctorscontra', validateDoctorLogin, validate, getDoctorByDniContra);

router.get('/api/doctorsId/:idDoctor', AdminOrPatient, validateDoctorId, validate, getDoctorById);

router.get('/api/doctorsdni', Doctor, validateUserDni, validate, getDoctorByDni);

export default router;

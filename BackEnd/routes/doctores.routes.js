import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  getDoctorByCredentials,
  getDoctorById,
  getAllDoctors,
  getAvailableDoctors,
} from '../controllers/doctores.controllers.js';
import { AdminOrPatient, Patient, Admin, Doctor } from '../middleware/authorizeRole.js';
import { validateDoctorLogin, validateDoctorId, validateLocationSpecBody, validateLocationIdBody, validateUserDni } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/doctors', Patient, validateLocationSpecBody, validate, getDoctors);

router.post('/api/availabledoctors', Patient, validateLocationIdBody, validate, getAvailableDoctors);

router.post('/api/alldoctors', Admin, getAllDoctors);

router.post('/api/doctorscontra', validateDoctorLogin, validate, getDoctorByCredentials);

router.get('/api/doctorsId/:idDoctor', AdminOrPatient, validateDoctorId, validate, getDoctorById);

router.get('/api/doctorsdni', Doctor, validateUserDni, validate, getDoctorByDni);

export default router;

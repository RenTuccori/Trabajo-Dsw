import { Router } from 'express';
import {
  getDoctors,
  getDoctorByNationalId,
  getDoctorByCredentials,
  getDoctorById,
  getAllDoctors,
  getAvailableDoctors,
} from '../controllers/doctors.controllers.js';
import { AdminOrPatient, Patient, Admin, Doctor } from '../middleware/authorizeRole.js';
import { validateDoctorLogin, validateDoctorId, validateLocationSpecBody, validateLocationIdBody, validateUserNationalId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/doctors', Patient, validateLocationSpecBody, validate, getDoctors);

router.post('/api/doctors/available', Patient, validateLocationIdBody, validate, getAvailableDoctors);

router.post('/api/doctors/all', Admin, getAllDoctors);

router.post('/api/doctors/login', validateDoctorLogin, validate, getDoctorByCredentials);

router.get('/api/doctors/:id', AdminOrPatient, validateDoctorId, validate, getDoctorById);

router.get('/api/doctors/nationalId', Doctor, validateUserNationalId, validate, getDoctorByNationalId);

export default router;

import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  getDoctorByDniContra,
  getDoctorById
} from '../controllers/doctores.controllers.js';

const router = Router();

router.post('/api/doctors', getDoctors);

router.post('/api/doctorscontra', getDoctorByDniContra);

router.get('/api/doctorsId/:idDoctor', getDoctorById);

router.get('/api/doctorsdni', getDoctorByDni);


export default router;

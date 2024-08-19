import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  createDoctor,
  deleteDoctor,
  getDoctorByDniContra,
  getDoctorById
} from '../controllers/doctores.controllers.js';

const router = Router();

router.post('/api/doctors', getDoctors);

router.post('/api/doctorscontra', getDoctorByDniContra);

router.get('/api/doctorsId', getDoctorById);

router.get('/api/doctorsdni', getDoctorByDni);

router.post('/api/doctors/', createDoctor);

router.delete('/api/doctors/', deleteDoctor);

export default router;

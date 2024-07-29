import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctores.controllers.js';

const router = Router();

router.get('/api/doctors', getDoctors);

router.get('/api/doctors/', getDoctorByDni);

router.post('/api/doctors/', createDoctor);

router.put('/api/doctors/', updateDoctor);

router.delete('/api/doctors/', deleteDoctor);

export default router;

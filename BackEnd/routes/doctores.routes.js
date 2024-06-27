import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctores.controllers.js';

const router = Router();

router.get('/doctors', getDoctors);

router.get('/doctors/:dni', getDoctorByDni);

router.post('/doctors', createDoctor);

router.put('/doctors/:dni', updateDoctor);

router.delete('/doctors/:dni', deleteDoctor);

export default router;

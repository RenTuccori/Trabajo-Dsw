import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  getDoctorByDniContra,
  getDoctorById,
  getDoctores
} from '../controllers/doctores.controllers.js';

const router = Router();

//Doctores a partir de sede y especialidad
router.post('/api/doctors', getDoctors);
//Todos los doctores
router.post('/api/alldoctors', getDoctores);

router.post('/api/doctorscontra', getDoctorByDniContra);

router.get('/api/doctorsId/:idDoctor', getDoctorById);

router.get('/api/doctorsdni', getDoctorByDni);


export default router;

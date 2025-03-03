import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  getDoctorByDniContra,
  getDoctorById,
  getDoctores,
  getAvailableDoctors
} from '../src/controllers/doctores.controllers.js';
import { AdminOrPaciente, Paciente } from '../middleware/authorizeRole.js';
const router = Router();

//Doctores a partir de sede y especialidad
router.post('/api/doctors', Paciente, getDoctors);

router.post('/api/availabledoctors', getAvailableDoctors);
//Todos los doctores
router.post('/api/alldoctors', getDoctores);

router.post('/api/doctorscontra', getDoctorByDniContra);

router.get('/api/doctorsId/:idDoctor', AdminOrPaciente, getDoctorById);

router.get('/api/doctorsdni', getDoctorByDni);

export default router;

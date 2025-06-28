import { Router } from 'express';
import {
  getTurnoByDni,
  createAppointment,
  deleteAppointment,
  getTurnoByDoctorHistorico,
  getTurnoByDoctorHoy,
  getTurnoByDoctorFecha,
  confirmAppointment,
  cancelAppointment,
} from '../controllers/appointments.controllers.js';
import { Doctor, Patient } from '../middleware/authorizeRole.js';
const router = Router();

router.post('/api/turnospac', Patient, getTurnoByDni);

router.post('/api/turnosdochoy', Doctor, getTurnoByDoctorHoy);

router.post('/api/turnosdoc', Doctor, getTurnoByDoctorHistorico);

router.post('/api/turnosdocfecha', Doctor, getTurnoByDoctorFecha);

router.post('/api/appointments', Patient, createAppointment);

router.put('/api/appointments', Patient, confirmAppointment);

router.delete('/api/appointments/:id', deleteAppointment);

router.put('/api/turnoscancel', Patient, cancelAppointment);

export default router;

import { Router } from 'express';
import {
  getAppointmentByDni,
  createAppointment,
  deleteAppointment,
  getAppointmentsByDoctorHistory,
  getAppointmentsByDoctorToday,
  getAppointmentsByDoctorDate,
  confirmAppointment,
  cancelAppointment,
} from '../controllers/turnos.controllers.js';
import { Doctor, Patient } from '../middleware/authorizeRole.js';
import { validateCreateAppointment, validateAppointmentAction, validateAppointmentId, validateUserDni } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/turnospac', Patient, validateUserDni, validate, getAppointmentByDni);

router.post('/api/turnosdochoy', Doctor, getAppointmentsByDoctorToday);

router.post('/api/turnosdoc', Doctor, getAppointmentsByDoctorHistory);

router.post('/api/turnosdocfecha', Doctor, getAppointmentsByDoctorDate);

router.post('/api/turnos', Patient, validateCreateAppointment, validate, createAppointment);

router.put('/api/turnos', Patient, validateAppointmentAction, validate, confirmAppointment);

router.delete('/api/turnos/:id', validateAppointmentId, validate, deleteAppointment);

router.put('/api/turnoscancel', Patient, validateAppointmentAction, validate, cancelAppointment);

export default router;

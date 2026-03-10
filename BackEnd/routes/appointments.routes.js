import { Router } from 'express';
import {
  getAppointmentByNationalId,
  createAppointment,
  deleteAppointment,
  getAppointmentsByDoctorHistory,
  getAppointmentsByDoctorToday,
  getAppointmentsByDoctorDate,
  confirmAppointment,
  cancelAppointment,
} from '../controllers/appointments.controllers.js';
import { Doctor, Patient } from '../middleware/authorizeRole.js';
import { validateCreateAppointment, validateAppointmentAction, validateAppointmentId, validateUserNationalId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/appointments/patient', Patient, validateUserNationalId, validate, getAppointmentByNationalId);

router.post('/api/appointments/doctor/today', Doctor, getAppointmentsByDoctorToday);

router.post('/api/appointments/doctor/history', Doctor, getAppointmentsByDoctorHistory);

router.post('/api/appointments/doctor/date', Doctor, getAppointmentsByDoctorDate);

router.post('/api/appointments', Patient, validateCreateAppointment, validate, createAppointment);

router.put('/api/appointments/confirm', Patient, validateAppointmentAction, validate, confirmAppointment);

router.delete('/api/appointments/:id', validateAppointmentId, validate, deleteAppointment);

router.put('/api/appointments/cancel', Patient, validateAppointmentAction, validate, cancelAppointment);

export default router;

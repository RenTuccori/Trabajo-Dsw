import { Router } from 'express';
import {
  getAvailableDatesByDocSpecLoc,
  getAvailableDatesBySpecLoc,
  getAvailableSchedulesByDocSpecLoc,
  getAvailableSchedulesBySpecLoc,
} from '../controllers/schedules.controllers.js';
import { AdminOrPatient } from '../middleware/authorizeRole.js';
import { validateAvailableDates, validateAvailableSchedules } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/schedules/available/doctor-specialty-location', AdminOrPatient, validateAvailableDates, validate, getAvailableDatesByDocSpecLoc);

router.post('/api/schedules/available/specialty-location', AdminOrPatient, validateAvailableDates, validate, getAvailableDatesBySpecLoc);

router.post('/api/schedules/doctor-specialty-location', AdminOrPatient, validateAvailableSchedules, validate, getAvailableSchedulesByDocSpecLoc);

router.post('/api/schedules/specialty-location', AdminOrPatient, validateAvailableSchedules, validate, getAvailableSchedulesBySpecLoc);

export default router;

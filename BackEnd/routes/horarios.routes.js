import { Router } from 'express';
import {
  getAvailableDatesByDocSpecLoc,
  getAvailableDatesBySpecLoc,
  getAvailableSchedulesByDocSpecLoc,
  getAvailableSchedulesBySpecLoc,
} from '../controllers/horarios.controllers.js';
import { AdminOrPatient } from '../middleware/authorizeRole.js';
import { validateAvailableDates, validateAvailableSchedules } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/DispDocEspSed', AdminOrPatient, validateAvailableDates, validate, getAvailableDatesByDocSpecLoc);

router.post('/api/DispEspSed', AdminOrPatient, validateAvailableDates, validate, getAvailableDatesBySpecLoc);

router.post('/api/HorariosDispDocEspSed', AdminOrPatient, validateAvailableSchedules, validate, getAvailableSchedulesByDocSpecLoc);

router.post('/api/HorariosDispEspSed', AdminOrPatient, validateAvailableSchedules, validate, getAvailableSchedulesBySpecLoc);

export default router;

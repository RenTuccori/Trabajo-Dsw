import { Router } from 'express';
import {
  getAvailableDatesByDoctorSpecialtyVenue,
  getAvailableDatesBySpecialtyVenue,
  getAvailableSchedulesByDoctorSpecialtyVenue,
  getAvailableSchedulesBySpecialtyVenue,
} from '../controllers/schedules.controllers.js';
import { AdminOrPatient } from '../middleware/authorizeRole.js';
const router = Router();

router.post('/api/DispDocEspSed', AdminOrPatient, getAvailableDatesByDoctorSpecialtyVenue);
router.get('/api/DispEspSed', AdminOrPatient, getAvailableDatesBySpecialtyVenue);
router.post(
  '/api/HorariosDispDocEspSed',
  AdminOrPatient,
  getAvailableSchedulesByDoctorSpecialtyVenue
);

export default router;

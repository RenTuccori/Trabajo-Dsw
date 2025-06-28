import { Router } from 'express';
import {
  getFechasDispDocEspSed,
  getFechasDispEspSed,
  getHorariosDispDocEspSed,
} from '../controllers/horarios.controllers.js';
import { AdminOrPatient } from '../middleware/authorizeRole.js';
const router = Router();

router.post('/api/DispDocEspSed', AdminOrPatient, getFechasDispDocEspSed);
router.get('/api/DispEspSed', AdminOrPatient, getFechasDispEspSed);
router.post(
  '/api/HorariosDispDocEspSed',
  AdminOrPatient,
  getHorariosDispDocEspSed
);

export default router;

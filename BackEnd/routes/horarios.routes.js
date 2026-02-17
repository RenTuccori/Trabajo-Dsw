import { Router } from 'express';
import {
  getFechasDispDocEspSed,
  getFechasDispEspSed,
  getHorariosDispDocEspSed,
  getHorariosDispEspSed,
} from '../controllers/horarios.controllers.js';
import { AdminOrPatient } from '../middleware/authorizeRole.js';
import { validateFechasDisp, validateHorariosDisp } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/DispDocEspSed', AdminOrPatient, validateFechasDisp, validate, getFechasDispDocEspSed);

router.post('/api/DispEspSed', AdminOrPatient, validateFechasDisp, validate, getFechasDispEspSed);

router.post('/api/HorariosDispDocEspSed', AdminOrPatient, validateHorariosDisp, validate, getHorariosDispDocEspSed);

router.post('/api/HorariosDispEspSed', AdminOrPatient, validateHorariosDisp, validate, getHorariosDispEspSed);

export default router;

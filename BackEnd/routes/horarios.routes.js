import { Router } from 'express';
import {
  getFechasDispDocEspSed,
  getFechasDispEspSed,
  getHorariosDispDocEspSed
} from '../controllers/horarios.controllers.js';
import { AdminOrPaciente, Paciente } from '../middleware/authorizeRole.js';
const router = Router();

router.post('/api/DispDocEspSed', AdminOrPaciente, getFechasDispDocEspSed);
router.get('/api/DispEspSed', AdminOrPaciente, getFechasDispEspSed);
router.post('/api/HorariosDispDocEspSed', AdminOrPaciente, getHorariosDispDocEspSed);

export default router;

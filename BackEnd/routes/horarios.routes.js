import { Router } from 'express';
import {
  getFechasDispDocEspSed,
  getFechasDispEspSed,
  getHorariosDispDocEspSed
} from '../controllers/horarios.controllers.js';

const router = Router();

router.post('/api/DispDocEspSed', getFechasDispDocEspSed);
router.get('/api/DispEspSed', getFechasDispEspSed);
router.post('/api/HorariosDispDocEspSed', getHorariosDispDocEspSed);

export default router;

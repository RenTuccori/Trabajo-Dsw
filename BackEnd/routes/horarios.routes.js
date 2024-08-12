import { Router } from 'express';
import {
  getFechasDispDocEspSed,
  getFechasDispEspSed,
  getHorariosDispDocEspSed
} from '../controllers/horarios.controllers.js';

const router = Router();

router.get('/api/DispDocEspSed', getFechasDispDocEspSed);
router.get('/api/DispEspSed', getFechasDispEspSed);
router.get('/api/HorariosDispDocEspSed', getHorariosDispDocEspSed);

export default router;

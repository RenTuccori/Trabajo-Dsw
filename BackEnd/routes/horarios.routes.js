import { Router } from 'express';
import {
  getHorariosDispDocEspSed,
  getHorariosDispEspSed
} from '../controllers/horarios.controllers.js';

const router = Router();

router.get('/api/DispDocEspSed', getHorariosDispDocEspSed);
router.get('/api/DispEspSed', getHorariosDispEspSed);

export default router;

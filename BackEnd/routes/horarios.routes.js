import { Router } from 'express';
import {
  getHorariosDisp
} from '../controllers/horarios.controllers.js';

const router = Router();

router.get('/api/horariosdisp', getHorariosDisp);

export default router;

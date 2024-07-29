import { Router } from 'express';
import {
  getTurnoByDni,
  createTurno,
  deleteTurno,
} from '../controllers/turnos.controllers.js';

const router = Router();

router.get('/api/turnos/:dni', getTurnoByDni);

router.post('/api/turnos', createTurno);

router.delete('/api/turnos/:id', deleteTurno);

export default router;
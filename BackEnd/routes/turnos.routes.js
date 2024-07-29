import { Router } from 'express';
import {
  getTurnos,
  getTurnoById,
  createTurno,
  deleteTurno,
} from '../controllers/turnos.controllers.js';

const router = Router();

router.get('/api/turnos', getTurnos);

router.get('/api/turnos/:id', getTurnoById);

router.post('/api/turnos', createTurno);

router.delete('/api/turnos/:id', deleteTurno);

export default router;
import { Router } from 'express';
import {
  getTurnos,
  getTurnoById,
  createTurno,
  deleteTurno,
} from '../controllers/turnos.controllers.js';

const router = Router();

router.get('/turnos', getTurnos);

router.get('/turnos/:id', getTurnoById);

router.post('/turnos', createTurno);

router.delete('/turnos/:id', deleteTurno);

export default router;
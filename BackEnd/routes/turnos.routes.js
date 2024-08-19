import { Router } from 'express';
import {
  getTurnoByDni,
  createTurno,
  deleteTurno,
  getTurnoByDoctorHistorico,
  getTurnoByDoctorHoy,
  getTurnoByDoctorFecha
} from '../controllers/turnos.controllers.js';

const router = Router();

router.get('/api/turnos', getTurnoByDni);

router.post('/api/turnosdochoy', getTurnoByDoctorHoy);

router.post('/api/turnosdoc', getTurnoByDoctorHistorico);

router.post('/api/turnosdocfecha', getTurnoByDoctorFecha);

router.post('/api/turnos', createTurno);

router.delete('/api/turnos/:id', deleteTurno);

export default router; 
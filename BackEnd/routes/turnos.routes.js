import { Router } from 'express';
import {
  getTurnoByDni,
  createTurno,
  deleteTurno,
  getTurnoByDoctorHistorico,
  getTurnoByDoctorHoy,
  getTurnoByDoctorFecha,
  confirmarTurno,
  cancelarTurno,
} from '../controllers/turnos.controllers.js';
import { Doctor, Patient } from '../middleware/authorizeRole.js';
const router = Router();

router.post('/api/turnospac', Patient, getTurnoByDni);

router.post('/api/turnosdochoy', Doctor, getTurnoByDoctorHoy);

router.post('/api/turnosdoc', Doctor, getTurnoByDoctorHistorico);

router.post('/api/turnosdocfecha', Doctor, getTurnoByDoctorFecha);

router.post('/api/turnos', Patient, createTurno);

router.put('/api/turnos', Patient, confirmarTurno);

router.delete('/api/turnos/:id', deleteTurno);

router.put('/api/turnoscancel', Patient, cancelarTurno);

export default router;

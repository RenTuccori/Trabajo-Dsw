import { Router } from 'express';
import {
  getTurnoByDni,
  createTurno,
  deleteTurno,
  getTurnoByDoctorHistorico,
  getTurnoByDoctorHoy,
  getTurnoByDoctorFecha,
  confirmarTurno,
  cancelarTurno
} from '../controllers/turnos.controllers.js';

const router = Router();

router.post('/api/turnospac', getTurnoByDni);

router.post('/api/turnosdochoy', getTurnoByDoctorHoy);

router.post('/api/turnosdoc', getTurnoByDoctorHistorico);

router.post('/api/turnosdocfecha', getTurnoByDoctorFecha);

router.post('/api/turnos', createTurno);

router.put('/api/turnos', confirmarTurno);

router.delete('/api/turnos/:id', deleteTurno);

router.put('/api/turnoscancel', cancelarTurno);


export default router; 
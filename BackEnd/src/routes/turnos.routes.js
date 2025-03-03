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
} from '../src/controllers/turnos.controllers.js';
import { Doctor } from '../middleware/authorizeRole.js';
import { Paciente } from '../middleware/authorizeRole.js';
const router = Router();

router.post('/api/turnospac', Paciente, getTurnoByDni);

router.post('/api/turnosdochoy', Doctor, getTurnoByDoctorHoy);

router.post('/api/turnosdoc', Doctor, getTurnoByDoctorHistorico);

router.post('/api/turnosdocfecha', Doctor, getTurnoByDoctorFecha);

router.post('/api/turnos', Paciente, createTurno);

router.put('/api/turnos', Paciente, confirmarTurno);

router.delete('/api/turnos/:id', deleteTurno);

router.put('/api/turnoscancel', Paciente, cancelarTurno);



export default router; 
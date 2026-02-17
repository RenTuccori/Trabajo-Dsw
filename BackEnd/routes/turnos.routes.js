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
import { validateCreateTurno, validateTurnoAction, validateTurnoId, validateUserDni } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/turnospac', Patient, validateUserDni, validate, getTurnoByDni);

router.post('/api/turnosdochoy', Doctor, getTurnoByDoctorHoy);

router.post('/api/turnosdoc', Doctor, getTurnoByDoctorHistorico);

router.post('/api/turnosdocfecha', Doctor, getTurnoByDoctorFecha);

router.post('/api/turnos', Patient, validateCreateTurno, validate, createTurno);

router.put('/api/turnos', Patient, validateTurnoAction, validate, confirmarTurno);

router.delete('/api/turnos/:id', validateTurnoId, validate, deleteTurno);

router.put('/api/turnoscancel', Patient, validateTurnoAction, validate, cancelarTurno);

export default router;

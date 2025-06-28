import { Router } from 'express';
import {
  getSedes,
  getSedeById,
  createSede,
  updateSede,
  deleteSede,
  getDoctoresBySede
} from '../controllers/sedes.controllers.js';
import { AdminOrPaciente, Paciente, Admin } from '../middleware/authorizeRole.js';

const router = Router();

router.get('/api/sedes', AdminOrPaciente, getSedes);
router.get('/api/sedes/:id', AdminOrPaciente, getSedeById);
router.post('/api/sedes', Admin, createSede);
router.put('/api/sedes/:id', Admin, updateSede);
router.delete('/api/sedes/:id', Admin, deleteSede);
router.get('/api/sedes/:id/doctores', AdminOrPaciente, getDoctoresBySede);

export default router;

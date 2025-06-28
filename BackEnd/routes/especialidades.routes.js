import { Router } from 'express';
import {
  getEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
  getDoctoresByEspecialidad
} from '../controllers/especialidades.controllers.js';
import { Admin } from '../middleware/authorizeRole.js';

const router = Router();

router.get('/api/especialidades', getEspecialidades);
router.get('/api/especialidades/:id', getEspecialidadById);
router.post('/api/especialidades', Admin, createEspecialidad);
router.put('/api/especialidades/:id', Admin, updateEspecialidad);
router.delete('/api/especialidades/:id', Admin, deleteEspecialidad);
router.get('/api/especialidades/:id/doctores', getDoctoresByEspecialidad);

export default router;

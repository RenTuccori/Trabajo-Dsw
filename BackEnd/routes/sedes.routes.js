import { Router } from 'express';
import {
  getSedes,
  getSedeById,
} from '../controllers/sedes.controllers.js';
import { AdminOrPaciente, Paciente } from '../middleware/authorizeRole.js';
const router = Router();

router.get('/api/sedes', AdminOrPaciente, getSedes);

router.get('/api/sedes/:idSede',Paciente, getSedeById);

export default router;
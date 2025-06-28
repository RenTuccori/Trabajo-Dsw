import { Router } from 'express';
import { getSedes, getSedeById } from '../controllers/sedes.controllers.js';
import { AdminOrPatient, Patient } from '../middleware/authorizeRole.js';
const router = Router();

router.get('/api/sedes', AdminOrPatient, getSedes);

router.get('/api/sedes/:idSede', Patient, getSedeById);

export default router;

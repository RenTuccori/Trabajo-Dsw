import { Router } from 'express';
import { getSedes, getSedeById } from '../controllers/sedes.controllers.js';
import { AdminOrPatient, Patient } from '../middleware/authorizeRole.js';
import { validateSedeId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/api/sedes', AdminOrPatient, getSedes);

router.get('/api/sedes/:idSede', Patient, validateSedeId, validate, getSedeById);

export default router;

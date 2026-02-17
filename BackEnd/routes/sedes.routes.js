import { Router } from 'express';
import { getLocations, getLocationById } from '../controllers/sedes.controllers.js';
import { AdminOrPatient, Patient } from '../middleware/authorizeRole.js';
import { validateLocationId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/api/sedes', AdminOrPatient, getLocations);

router.get('/api/sedes/:idSede', Patient, validateLocationId, validate, getLocationById);

export default router;

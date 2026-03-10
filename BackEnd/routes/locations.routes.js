import { Router } from 'express';
import { getLocations, getLocationById } from '../controllers/locations.controllers.js';
import { AdminOrPatient, Patient } from '../middleware/authorizeRole.js';
import { validateLocationId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/api/locations', AdminOrPatient, getLocations);

router.get('/api/locations/:id', Patient, validateLocationId, validate, getLocationById);

export default router;

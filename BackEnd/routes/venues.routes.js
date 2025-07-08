import { Router } from 'express';
import { getVenues, getVenueById } from '../controllers/venues.controllers.js';
import { AdminOrPatient, Patient } from '../middleware/authorizeRole.js';
const router = Router();

router.get('/api/venues', AdminOrPatient, getVenues);

router.get('/api/venues/:venueId', Patient, getVenueById);

export default router;

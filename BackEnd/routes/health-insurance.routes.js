import { Router } from 'express';
import {
  getHealthInsuranceList,
  getHealthInsuranceById,
} from '../controllers/health-insurance.controllers.js';
import { validateHealthInsuranceId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/api/health-insurance', getHealthInsuranceList);

router.get('/api/health-insurance/:id', validateHealthInsuranceId, validate, getHealthInsuranceById);

export default router;

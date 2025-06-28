import { Router } from 'express';
import {
  getInsurances,
  getInsuranceById,
} from '../controllers/insurance.controllers.js';

const router = Router();

router.get('/api/os', getInsurances);

router.get('/api/osid', getInsuranceById);

export default router;

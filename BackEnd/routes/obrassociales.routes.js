import { Router } from 'express';
import {
  getObrasSociales,
  getObraSocialById,
} from '../controllers/obrassociales.controllers.js';
import { validateObraSocialId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/api/os', getObrasSociales);

router.get('/api/osid', validateObraSocialId, validate, getObraSocialById);

export default router;

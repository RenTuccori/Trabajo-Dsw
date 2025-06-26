import { Router } from 'express';
import {
  getObrasSociales,
  getObraSocialById,
} from '../controllers/obrassociales.controllers.js';

const router = Router();

router.get('/api/os', getObrasSociales);

router.get('/api/osid', getObraSocialById);

export default router;

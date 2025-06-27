import { Router } from 'express';
import {
  getObrasSociales,    // ✅ Nombre correcto (sin capital S)
  getObraSocialById,   // ✅ Correcto
} from '../controllers/obrassociales.controllers.js';

const router = Router();

router.get('/api/os', getObrasSociales);
router.get('/api/osid', getObraSocialById);

export default router;

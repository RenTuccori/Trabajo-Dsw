import { Router } from 'express';
import {
  getSedes,
  getSedeById,
} from '../controllers/sedes.controllers.js';

const router = Router();

router.get('/api/sedes', getSedes);

router.get('/api/sedes/:id', getSedeById);

export default router;
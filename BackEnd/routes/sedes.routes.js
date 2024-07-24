import { Router } from 'express';
import {
  getSedes,
  getSedeById,
} from '../controllers/sedes.controllers.js';

const router = Router();

router.get('/sedes', getSedes);

router.get('/sedes/:id', getSedeById);

export default router;
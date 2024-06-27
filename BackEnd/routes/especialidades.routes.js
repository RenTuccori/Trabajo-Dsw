import { Router } from 'express';
import {
  getSpecialties,
  getSpecialtyById,
  createSpecialty,
  deleteSpecialty,
  updateSpecialty,
} from '../controllers/especialidades.controllers.js';

const router = Router();

router.get('/specialties', getSpecialties);

router.get('/specialties/:id', getSpecialtyById);

router.post('/specialties', createSpecialty);

router.put('/specialties/:id', updateSpecialty);

router.delete('/specialties/:id', deleteSpecialty);

export default router;

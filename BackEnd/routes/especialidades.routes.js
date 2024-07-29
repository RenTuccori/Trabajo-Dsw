import { Router } from 'express';
import {
  getSpecialties,
  getSpecialtyById,
  createSpecialty,
  deleteSpecialty,
  updateSpecialty,
} from '../controllers/especialidades.controllers.js';

const router = Router();

router.get('/api/specialties', getSpecialties);

router.get('/api/specialties/:id', getSpecialtyById);

router.post('/api/specialties', createSpecialty);

router.put('/api/specialties/:id', updateSpecialty);

router.delete('/api/specialties/:id', deleteSpecialty);

export default router;

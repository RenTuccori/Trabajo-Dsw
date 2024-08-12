import { Router } from 'express';
import {
  getSpecialties,
  getSpecialtyById,
  createSpecialty,
  deleteSpecialty,
  updateSpecialty,
} from '../controllers/especialidades.controllers.js';

const router = Router();

router.get('/api/allspecialties', getSpecialties);

router.get('/api/idspecialties', getSpecialtyById);

router.post('/api/specialties/', createSpecialty);

router.put('/api/specialties/', updateSpecialty);

router.delete('/api/specialties/', deleteSpecialty);

export default router;

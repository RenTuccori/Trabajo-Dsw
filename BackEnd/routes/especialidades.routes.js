import { Router } from 'express';
import {
  getSpecialties,
  getAvailableSpecialties,
  getSpecialtyById,
  createSpecialty,
  deleteSpecialty,
  updateSpecialty,
  getAllSpecialities
} from '../controllers/especialidades.controllers.js';

const router = Router();

router.post('/api/allspecialties', getSpecialties);

router.post('/api/allespecialties', getAllSpecialities);

router.post('/api/availablespecialties', getAvailableSpecialties);

router.get('/api/idspecialties/:idEspecialidad', getSpecialtyById);

router.post('/api/specialties/', createSpecialty);

router.put('/api/specialties/', updateSpecialty);

router.delete('/api/specialties/', deleteSpecialty);

export default router;

import { Router } from 'express';
import {
    getObrasSociales,
    getObraSocialById,
    createObraSocial
} from '../controllers/obrassociales.controller.js'; 

const router = Router();

router.get('/api/medicalinsurance', getObrasSociales);

router.get('/api/medicalinsuranceId/', getObraSocialById);

router.post('/api/medicalinsurance/', createObraSocial);


export default router;
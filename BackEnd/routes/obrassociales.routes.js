import { Router } from 'express';
import {
    getObrasSociales,
    getObraSocialById
} from '../controllers/obrassociales.controller.js';

const router = Router();

router.get('/api/os', getObrasSociales);

router.get('/api/osid', getObraSocialById);


export default router;
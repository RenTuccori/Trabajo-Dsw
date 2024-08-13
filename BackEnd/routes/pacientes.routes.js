import { Router } from 'express';
import {
    getPacientes,
    getPacienteByDni,
    createPaciente
} from '../controllers/pacientes.controllers.js';

const router = Router();

router.get('/api/patient', getPacientes);

router.get('/api/patientDni', getPacienteByDni);

router.post('/api/patient/', createPaciente);

export default router;

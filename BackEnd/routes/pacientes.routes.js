import { Router } from 'express';
import {
    getPacientes,
    getPacienteByDni,
    createPaciente
} from '../controllers/pacientes.controllers.js';

const router = Router();

router.get('/api/patient', getPacientes);

router.post('/api/patientdni', getPacienteByDni);

router.post('/api/patientcreate', createPaciente);

export default router;

import { Router } from 'express';
import {
    getPacientes,
    getPacienteByDni,
    createPaciente
} from '../src/controllers/pacientes.controllers.js';
import { Paciente } from '../middleware/authorizeRole.js';

const router = Router();

router.get('/api/patient', getPacientes);

router.post('/api/patientdni', Paciente, getPacienteByDni);

router.post('/api/patientcreate', createPaciente);

export default router;

import { Router } from 'express';
import {
  createEstudio,
  getEstudiosByPaciente,
  getEstudiosByDoctor,
  downloadEstudio,
  deleteEstudio,
  upload,
} from '../controllers/estudios.controllers.js';
import { Doctor, Patient, DoctorOrPatient } from '../middleware/authorizeRole.js';
import { validateEstudioUpload, validateEstudioId, validatePacienteIdParam, validateDoctorId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/estudios/upload', Doctor, upload.single('archivo'), validateEstudioUpload, validate, createEstudio);

router.get('/api/estudios/paciente/:idPaciente', Patient, validatePacienteIdParam, validate, getEstudiosByPaciente);

router.get('/api/estudios/doctor/:idDoctor', Doctor, validateDoctorId, validate, getEstudiosByDoctor);

router.get('/api/estudios/download/:idEstudio', DoctorOrPatient, validateEstudioId, validate, downloadEstudio);

router.delete('/api/estudios/:idEstudio', Doctor, validateEstudioId, validate, deleteEstudio);

export default router;

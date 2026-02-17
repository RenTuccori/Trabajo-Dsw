import { Router } from 'express';
import {
  createStudy,
  getStudiesByPatient,
  getStudiesByDoctor,
  downloadStudy,
  deleteStudy,
  upload,
} from '../controllers/estudios.controllers.js';
import { Doctor, Patient, DoctorOrPatient } from '../middleware/authorizeRole.js';
import { validateStudyUpload, validateStudyId, validatePatientIdParam, validateDoctorId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/estudios/upload', Doctor, upload.single('archivo'), validateStudyUpload, validate, createStudy);

router.get('/api/estudios/paciente/:idPaciente', Patient, validatePatientIdParam, validate, getStudiesByPatient);

router.get('/api/estudios/doctor/:idDoctor', Doctor, validateDoctorId, validate, getStudiesByDoctor);

router.get('/api/estudios/download/:idEstudio', DoctorOrPatient, validateStudyId, validate, downloadStudy);

router.delete('/api/estudios/:idEstudio', Doctor, validateStudyId, validate, deleteStudy);

export default router;

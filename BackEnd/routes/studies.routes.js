import { Router } from 'express';
import {
  createStudy,
  getStudiesByPatient,
  getStudiesByDoctor,
  downloadStudy,
  deleteStudy,
  upload,
} from '../controllers/studies.controllers.js';
import { Doctor, Patient, DoctorOrPatient } from '../middleware/authorizeRole.js';
import { validateStudyUpload, validateStudyId, validatePatientIdParam, validateDoctorId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/studies/upload', Doctor, upload.single('file'), validateStudyUpload, validate, createStudy);

router.get('/api/studies/patient/:patientId', Patient, validatePatientIdParam, validate, getStudiesByPatient);

router.get('/api/studies/doctor/:doctorId', Doctor, validateDoctorId, validate, getStudiesByDoctor);

router.get('/api/studies/download/:id', DoctorOrPatient, validateStudyId, validate, downloadStudy);

router.delete('/api/studies/:id', Doctor, validateStudyId, validate, deleteStudy);

export default router;

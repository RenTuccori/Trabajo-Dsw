import { Router } from 'express';
import {
  createEstudio,
  getEstudiosByPaciente,
  getEstudiosByDoctor,
  getEstudioById,
  deleteEstudio,
  upload, // ✅ Importar desde el controlador
} from '../controllers/estudios.controllers.js';
import { Doctor, Paciente } from '../middleware/authorizeRole.js';
import { Estudio } from '../models/index.js';

const router = Router();

// Ruta de prueba
router.get('/api/estudios/test', (req, res) => {
  res.json({ message: 'Rutas de estudios funcionando correctamente' });
});

// Subir un nuevo estudio (solo doctores)
router.post(
  '/api/estudios/upload',
  Doctor,
  upload.single('archivo'),
  createEstudio
);

// Obtener estudios por paciente (pacientes pueden ver sus estudios)
router.get(
  '/api/estudios/paciente/:idPaciente',
  Paciente,
  getEstudiosByPaciente
);

// Obtener estudios por doctor (doctores pueden ver sus estudios subidos)
router.get('/api/estudios/doctor/:idDoctor', Doctor, getEstudiosByDoctor);

// Obtener archivo de estudio para descarga
router.get('/api/estudios/download/:idEstudio', getEstudioById);

// Eliminar estudio (solo doctores)
router.delete('/api/estudios/:idEstudio', Doctor, deleteEstudio);

export default router;

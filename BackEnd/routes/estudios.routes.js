import { Router } from 'express';
import {
  createEstudio,
  getEstudiosByPaciente,
  getEstudiosByDoctor,
  downloadEstudio,
  deleteEstudio,
  upload,
} from '../controllers/estudios.controllers.js';
import { Doctor, Paciente } from '../middleware/authorizeRole.js';

const router = Router();

// Ruta de prueba
router.get('/api/estudios/test', (req, res) => {
  res.json({ message: 'Rutas de estudios funcionando correctamente' });
});

// Ruta de debug temporal para ver estudios
router.get('/api/estudios/debug', async (req, res) => {
  try {
    const { pool } = await import('../db.js');
    const [result] = await pool.query(
      `SELECT e.*, 
              p.dni as dniPaciente, up.nombre as nombrePaciente, up.apellido as apellidoPaciente,
              d.dni as dniDoctor, ud.nombre as nombreDoctor, ud.apellido as apellidoDoctor
       FROM estudios e
       LEFT JOIN pacientes p ON e.idPaciente = p.idPaciente
       LEFT JOIN usuarios up ON p.dni = up.dni
       LEFT JOIN doctores d ON e.idDoctor = d.idDoctor
       LEFT JOIN usuarios ud ON d.dni = ud.dni
       ORDER BY e.idEstudio DESC`
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

// Descargar archivo de estudio
router.get('/api/estudios/download/:idEstudio', downloadEstudio);

// Eliminar estudio (solo doctores)
router.delete('/api/estudios/:idEstudio', Doctor, deleteEstudio);

export default router;

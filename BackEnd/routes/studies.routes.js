import { Router } from 'express';
import {
  createStudy,
  getStudiesByPatient,
  getStudiesByDoctor,
  downloadStudy,
  deleteStudy,
  upload,
} from '../controllers/studies.controllers.js';
import { Doctor, Patient } from '../middleware/authorizeRole.js';

const router = Router();

// Ruta de prueba
router.get('/api/studies/test', (req, res) => {
  res.json({ message: 'Rutas de studies funcionando correctamente' });
});

// Ruta de debug temporal para ver studies
router.get('/api/studies/debug', async (req, res) => {
  try {
    const { pool } = await import('../db.js');
    const [result] = await pool.query(
      `SELECT e.*, 
              p.dni as dniPaciente, up.first_name as nombrePaciente, up.last_name as apellidoPaciente,
              d.dni as dniDoctor, ud.first_name as nombreDoctor, ud.last_name as apellidoDoctor
       FROM studies e
       LEFT JOIN patients p ON e.idPaciente = p.idPaciente
       LEFT JOIN users up ON p.dni = up.dni
       LEFT JOIN doctors d ON e.idDoctor = d.idDoctor
       LEFT JOIN users ud ON d.dni = ud.dni
       ORDER BY e.idEstudio DESC`
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subir un nuevo study (solo doctors)
router.post(
  '/api/studies/upload',
  Doctor,
  upload.single('archivo'),
  createStudy
);

// Obtener studies por patient (patients pueden ver sus studies)
router.get(
  '/api/studies/patient/:idPaciente',
  Patient,
  getStudiesByPatient
);

// Obtener studies por doctor (doctors pueden ver sus studies subidos)
router.get('/api/studies/doctor/:idDoctor', Doctor, getStudiesByDoctor);

// Descargar archivo de study
router.get('/api/studies/download/:idEstudio', downloadStudy);

// Eliminar study (solo doctors)
router.delete('/api/studies/:idEstudio', Doctor, deleteStudy);

export default router;

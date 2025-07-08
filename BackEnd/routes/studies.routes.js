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

// Test route
router.get('/api/studies/test', (req, res) => {
  res.json({ message: 'Studies routes working correctly' });
});

// Temporary debug route to view studies
router.get('/api/studies/debug', async (req, res) => {
  try {
    const { pool } = await import('../db.js');
    const [result] = await pool.query(
      `SELECT e.*, 
              p.dni as patientDni, up.first_name as patientFirstName, up.last_name as patientLastName,
              d.dni as doctorDni, ud.first_name as doctorFirstName, ud.last_name as doctorLastName
       FROM studies e
       LEFT JOIN patients p ON e.patientId = p.patientId
       LEFT JOIN users up ON p.dni = up.dni
       LEFT JOIN doctors d ON e.doctorId = d.doctorId
       LEFT JOIN users ud ON d.dni = ud.dni
       ORDER BY e.studyId DESC`
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload a new study (doctors only)
router.post(
  '/api/studies/upload',
  Doctor,
  upload.single('archivo'),
  createStudy
);

// Get studies by patient (patients can see their studies)
router.get(
  '/api/studies/patient/:patientId',
  Patient,
  getStudiesByPatient
);

// Get studies by doctor (doctors can see their uploaded studies)
router.get('/api/studies/doctor/:doctorId', Doctor, getStudiesByDoctor);

// Download study file
router.get('/api/studies/download/:studyId', downloadStudy);

// Delete study (doctors only)
router.delete('/api/studies/:studyId', Doctor, deleteStudy);

export default router;

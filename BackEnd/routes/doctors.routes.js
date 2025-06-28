import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  getDoctorByDniContra,
  getDoctorById,
  getDoctorsByVenueAndSpecialty,
} from '../controllers/doctors.controllers.js';
import { AdminOrPatient, Patient } from '../middleware/authorizeRole.js';
const router = Router();

// Ruta de debug para ver doctors
router.get('/api/doctors/debug', async (req, res) => {
  try {
    const { pool } = await import('../db.js');
    const [result] = await pool.query(
      `SELECT d.*, u.first_name, u.last_name 
       FROM doctors d 
       LEFT JOIN users u ON d.dni = u.dni 
       ORDER BY d.idDoctor`
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Doctores a partir de venue y specialty
router.post('/api/doctors', Patient, getDoctors);

router.post('/api/availabledoctors', getDoctorsByVenueAndSpecialty);
//Todos los doctors
router.post('/api/alldoctors', getDoctors);

router.post('/api/doctorscontra', getDoctorByDniContra);

router.get('/api/doctorsId/:idDoctor', AdminOrPatient, getDoctorById);

router.get('/api/doctorsdni', getDoctorByDni);

export default router;

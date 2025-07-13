import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  getDoctorByDniContra,
  getDoctorById,
  getDoctorsByVenueAndSpecialty,
} from '../controllers/doctors.controllers.js';
import {
  AdminOrPatient,
  Patient,
  AnyRole,
} from '../middleware/authorizeRole.js';
const router = Router();

// Debug route to view doctors
router.get('/api/doctors/debug', async (req, res) => {
  try {
    const { pool } = await import('../db.js');
    const [result] = await pool.query(
      `SELECT d.*, u.firstName, u.lastName 
       FROM doctors d 
       LEFT JOIN users u ON d.dni = u.dni 
       ORDER BY d.idDoctor`
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Doctors based on venue and specialty
router.post('/api/doctors', AnyRole, getDoctors);

router.post('/api/availabledoctors', getDoctorsByVenueAndSpecialty);
//All doctors
router.post('/api/alldoctors', getDoctors);

router.post('/api/doctorscontra', getDoctorByDniContra);

router.get('/api/doctorsId/:doctorId', AdminOrPatient, getDoctorById);

router.get('/api/doctorsdni', getDoctorByDni);

export default router;

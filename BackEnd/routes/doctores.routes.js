import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  getDoctorByDniContra,
  getDoctorById,
  getDoctores,
  getAvailableDoctors,
} from '../controllers/doctores.controllers.js';
import { AdminOrPaciente, Paciente } from '../middleware/authorizeRole.js';
const router = Router();

// Ruta de debug para ver doctores
router.get('/api/doctors/debug', async (req, res) => {
  try {
    const { pool } = await import('../db.js');
    const [result] = await pool.query(
      `SELECT d.*, u.nombre, u.apellido 
       FROM doctores d 
       LEFT JOIN usuarios u ON d.dni = u.dni 
       ORDER BY d.idDoctor`
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Doctores a partir de sede y especialidad
router.post('/api/doctors', Paciente, getDoctors);

router.post('/api/availabledoctors', getAvailableDoctors);
//Todos los doctores
router.post('/api/alldoctors', getDoctores);

router.post('/api/doctorscontra', getDoctorByDniContra);

router.get('/api/doctorsId/:idDoctor', AdminOrPaciente, getDoctorById);

router.get('/api/doctorsdni', getDoctorByDni);

export default router;

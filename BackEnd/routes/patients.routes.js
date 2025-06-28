import { Router } from 'express';
import {
  getPatients,
  getPacienteByDni,
  createPatient,
} from '../controllers/patients.controllers.js';
import { Patient } from '../middleware/authorizeRole.js';

const router = Router();

// Ruta de debug para ver patients
router.get('/api/patient/debug', async (req, res) => {
  try {
    const { pool } = await import('../db.js');
    const [result] = await pool.query(
      `SELECT pac.idPaciente, pac.dni, pac.estado, usu.first_name, usu.last_name 
       FROM patients pac 
       LEFT JOIN users usu ON pac.dni = usu.dni 
       ORDER BY pac.idPaciente`
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/patient', getPatients);

router.post('/api/patientdni', Patient, getPacienteByDni);

router.post('/api/patientcreate', createPatient);

export default router;

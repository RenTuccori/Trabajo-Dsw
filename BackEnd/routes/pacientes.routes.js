import { Router } from 'express';
import {
  getPacientes,
  getPacienteByDni,
  createPaciente,
} from '../controllers/pacientes.controllers.js';
import { Patient } from '../middleware/authorizeRole.js';

const router = Router();

// Ruta de debug para ver pacientes
router.get('/api/patient/debug', async (req, res) => {
  try {
    const { pool } = await import('../db.js');
    const [result] = await pool.query(
      `SELECT pac.idPaciente, pac.dni, pac.estado, usu.nombre, usu.apellido 
       FROM pacientes pac 
       LEFT JOIN usuarios usu ON pac.dni = usu.dni 
       ORDER BY pac.idPaciente`
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/patient', getPacientes);

router.post('/api/patientdni', Patient, getPacienteByDni);

router.post('/api/patientcreate', createPaciente);

export default router;

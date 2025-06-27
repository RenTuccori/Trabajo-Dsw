import { Router } from 'express';
import {
  getPacientes,      // ✅ Función correcta
  getPacienteByDni,  // ✅ Función correcta
  createPaciente,    // ✅ Función correcta
  updatePaciente,    // ✅ Función correcta
  deletePaciente,    // ✅ Función correcta
  getPacienteLogin   // ✅ Función correcta
} from '../controllers/pacientes.controllers.js';
import { Admin, Paciente, DoctorOrAdmin } from '../middleware/authorizeRole.js';

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

router.get('/api/pacientes', DoctorOrAdmin, getPacientes);
router.post('/api/paciente', getPacienteByDni);
router.post('/api/pacientes', Admin, createPaciente);
router.put('/api/pacientes/:id', Admin, updatePaciente);
router.delete('/api/pacientes/:id', Admin, deletePaciente);
router.post('/api/pacientelogin', getPacienteLogin);

export default router;

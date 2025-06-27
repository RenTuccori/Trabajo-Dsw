import { Router } from 'express';
import {
  getDoctors,
  getDoctorByDni,
  getDoctorLogin,
  getDoctorById,
  getDoctores,
  getAvailableDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctoresByEspecialidad,
  getDoctoresBySede
} from '../controllers/doctores.controllers.js';
import { AdminOrPaciente, Paciente, Admin, Doctor } from '../middleware/authorizeRole.js';

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

// Doctores a partir de sede y especialidad
router.post('/api/doctors', Paciente, getDoctors);
router.post('/api/availabledoctors', getAvailableDoctors);
// Todos los doctores
router.post('/api/alldoctors', getDoctores);
router.post('/api/doctorscontra', getDoctorLogin);
router.get('/api/doctorsId/:idDoctor', AdminOrPaciente, getDoctorById);
router.get('/api/doctorsdni', getDoctorByDni);

// CRUD
router.post('/api/doctores', Admin, createDoctor);
router.put('/api/doctores/:id', Admin, updateDoctor);
router.delete('/api/doctores/:id', Admin, deleteDoctor);

// Por especialidad y sede
router.get('/api/doctores/especialidad/:idEspecialidad', getDoctoresByEspecialidad);
router.get('/api/doctores/sede/:idSede', getDoctoresBySede);

export default router;

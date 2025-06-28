import { Router } from 'express';
import { Patient, AdminOrPatient } from '../middleware/authorizeRole.js';
import {
  getUsers,
  getUserByDniFecha,
  createUser,
  updateUser,
  deleteUser,
  getUserByDni,
} from '../controllers/usuarios.controllers.js';

const router = Router();

// Ruta de debug para ver usuarios
router.get('/api/users/debug', async (req, res) => {
  try {
    const { pool } = await import('../db.js');
    const [result] = await pool.query(
      `SELECT dni, nombre, apellido, fechaNacimiento FROM usuarios ORDER BY dni`
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/usersdni', Patient, getUserByDni);

router.post('/api/usersdnifecha', getUserByDniFecha);

router.get('/api/userstodos', Patient, getUsers);

router.post('/api/users', createUser);

router.put('/api/users/', AdminOrPatient, updateUser);

router.delete('/api/users/', deleteUser);

export default router;

import { Router } from 'express';
import {
  getUsers,
  getUserByDni,
  createUser,
  updateUser,
  deleteUser,
  getUserByDniFecha
} from '../controllers/usuarios.controllers.js';
import { Admin, Paciente, AdminOrPaciente } from '../middleware/authorizeRole.js';
import { Usuario } from '../models/index.js';

const router = Router();

// Ruta de debug para ver usuarios
router.get('/api/users/debug', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['dni', 'nombre', 'apellido', 'fechaNacimiento'],
      order: [['dni', 'ASC']]
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/usersdni', Paciente, getUserByDni);
router.post('/api/usersdnifecha', getUserByDniFecha);
router.get('/api/userstodos', Paciente, getUsers);
router.post('/api/users', createUser);
router.put('/api/users', AdminOrPaciente, updateUser);

router.delete('/api/users/', deleteUser);

export default router;

import { Router } from 'express';
import { Admin, AdminOrPaciente } from '../middleware/authorizeRole.js';
import {
  getAdmin,
  createSeEspDoc,
  deleteSeEspDoc,
  getCombinaciones,
  createHorarios,
  getHorariosXDoctor,
  updateHorarios,
} from '../controllers/admin.controllers.js';
import {
  createDoctor,
  deleteDoctor,
  updateDoctor,
} from '../controllers/doctores.controllers.js';
import {
  createSede,
  updateSede,
  deleteSede,
} from '../controllers/sedes.controllers.js';
import {
  createObraSocial,
  getObrasSociales,
  deleteObraSocial,
  updateObraSocial,
} from '../controllers/obrassociales.controllers.js';
import {
  createEspecialidad,
  deleteEspecialidad,
} from '../controllers/especialidades.controllers.js';
import {
  getUserByDni,
  createUser,
} from '../controllers/usuarios.controllers.js';

const router = Router();

router.post('/api/admin', getAdmin);
//Doctor
router.post('/api/adminCreateDr', Admin, createDoctor);
router.put('/api/adminDeleteDr/:idDoctor', Admin, deleteDoctor);
router.put('/api/adminUpdateDr/:idDoctor', Admin, updateDoctor);
//Sede
router.post('/api/adminCreateSede', Admin, createSede);
router.put('/api/adminUpdateSede/:idSede', Admin, updateSede);
router.put('/api/adminDeleteSede/:idSede', Admin, deleteSede);
//ObraSocial
router.post('/api/adminCreateObraSocial', Admin, createObraSocial);
router.get('/api/os', getObrasSociales);
router.put('/api/adminDeleteOS/:idObraSocial', Admin, deleteObraSocial);
router.put('/api/adminUpdateOS/:idObraSocial', Admin, updateObraSocial);
//Especialidad
router.post('/api/adminCreateEsp', Admin, createEspecialidad);
router.put('/api/deleteSpecialties/:idEspecialidad', Admin, deleteEspecialidad);
//Combinaciones
router.post('/api/adminCreateSeEspDoc', Admin, createSeEspDoc);
router.put('/api/adminDeleteSeEspDoc', Admin, deleteSeEspDoc);
router.get('/api/adminGetCombinaciones', Admin, getCombinaciones);
//Horarios
router.post('/api/adminCreateHorario', Admin, createHorarios);
router.post('/api/adminGetHorariosXDoctor', Admin, getHorariosXDoctor);
router.put('/api/adminUpdateHorario', Admin, updateHorarios);
//Usuarios
router.post('/api/adminGetUserByDni', Admin, getUserByDni);
router.post('/api/adminCreateUser', Admin, createUser);

export default router;

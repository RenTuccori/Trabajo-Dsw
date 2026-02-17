import { Router } from 'express';
import { Admin } from '../middleware/authorizeRole.js';
import {
  getAdminByUserContra,
  createCombinacion,
  deleteCombinacion,
  getCombinaciones,
  createHorario,
  getHorarios,
  updateHorario,
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
  createSpecialty,
  deleteSpecialty,
} from '../controllers/especialidades.controllers.js';
import {
  validateAdminLogin,
  validateCreateDoctor,
  validateDoctorId,
  validateUpdateDoctor,
  validateCreateSede,
  validateSedeId,
  validateCreateObraSocial,
  validateObraSocialId,
  validateUpdateObraSocial,
  validateCreateEspecialidad,
  validateEspecialidadId,
  validateCreateCombinacion,
  validateCreateHorario,
  validateDoctorIdBody,
} from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/admin', validateAdminLogin, validate, getAdminByUserContra);

// Doctor
router.post('/api/adminCreateDr', Admin, validateCreateDoctor, validate, createDoctor);
router.put('/api/adminDeleteDr/:idDoctor', Admin, validateDoctorId, validate, deleteDoctor);
router.put('/api/adminUpdateDr/:idDoctor', Admin, validateDoctorId, validate, updateDoctor);

// Sede
router.post('/api/adminCreateSede', Admin, validateCreateSede, validate, createSede);
router.put('/api/adminUpdateSede/:idSede', Admin, validateSedeId, validate, updateSede);
router.put('/api/adminDeleteSede/:idSede', Admin, validateSedeId, validate, deleteSede);

// ObraSocial
router.post('/api/adminCreateObraSocial', Admin, validateCreateObraSocial, validate, createObraSocial);
router.get('/api/os', getObrasSociales);
router.put('/api/adminDeleteOS/:idObraSocial', Admin, validateObraSocialId, validate, deleteObraSocial);
router.put('/api/adminUpdateOS/:idObraSocial', Admin, validateObraSocialId, validate, updateObraSocial);

// Especialidad
router.post('/api/adminCreateEsp', Admin, validateCreateEspecialidad, validate, createSpecialty);
router.put('/api/deleteSpecialties/:idEspecialidad', Admin, validateEspecialidadId, validate, deleteSpecialty);

// Combinaciones
router.post('/api/adminCreateSeEspDoc', Admin, validateCreateCombinacion, validate, createCombinacion);
router.put('/api/adminDeleteSeEspDoc', Admin, validateCreateCombinacion, validate, deleteCombinacion);
router.get('/api/adminGetCombinaciones', Admin, getCombinaciones);

// Horarios
router.post('/api/adminCreateHorario', Admin, validateCreateHorario, validate, createHorario);
router.post('/api/adminGetHorariosXDoctor', Admin, validateCreateCombinacion, validate, getHorarios);
router.put('/api/adminUpdateHorario', Admin, validateCreateHorario, validate, updateHorario);

export default router;

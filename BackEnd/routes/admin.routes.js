import { Router } from 'express';
import { Admin } from '../middleware/authorizeRole.js';
import {
  getAdminByCredentials,
  createCombination,
  deleteCombination,
  getCombinations,
  createSchedule,
  getSchedules,
  updateSchedule,
} from '../controllers/admin.controllers.js';
import {
  createDoctor,
  deleteDoctor,
  updateDoctor,
} from '../controllers/doctores.controllers.js';
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/sedes.controllers.js';
import {
  createHealthInsurance,
  getHealthInsuranceList,
  deleteHealthInsurance,
  updateHealthInsurance,
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
  validateCreateLocation,
  validateLocationId,
  validateCreateHealthInsurance,
  validateHealthInsuranceId,
  validateUpdateHealthInsurance,
  validateCreateSpecialty,
  validateSpecialtyId,
  validateCreateCombination,
  validateCreateSchedule,
} from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/admin', validateAdminLogin, validate, getAdminByCredentials);

// Doctor
router.post('/api/adminCreateDr', Admin, validateCreateDoctor, validate, createDoctor);
router.put('/api/adminDeleteDr/:idDoctor', Admin, validateDoctorId, validate, deleteDoctor);
router.put('/api/adminUpdateDr/:idDoctor', Admin, validateDoctorId, validate, updateDoctor);

// Location
router.post('/api/adminCreateSede', Admin, validateCreateLocation, validate, createLocation);
router.put('/api/adminUpdateSede/:idSede', Admin, validateLocationId, validate, updateLocation);
router.put('/api/adminDeleteSede/:idSede', Admin, validateLocationId, validate, deleteLocation);

// Health Insurance
router.post('/api/adminCreateObraSocial', Admin, validateCreateHealthInsurance, validate, createHealthInsurance);
router.get('/api/os', getHealthInsuranceList);
router.put('/api/adminDeleteOS/:idObraSocial', Admin, validateHealthInsuranceId, validate, deleteHealthInsurance);
router.put('/api/adminUpdateOS/:idObraSocial', Admin, validateHealthInsuranceId, validate, updateHealthInsurance);

// Specialty
router.post('/api/adminCreateEsp', Admin, validateCreateSpecialty, validate, createSpecialty);
router.put('/api/deleteSpecialties/:idEspecialidad', Admin, validateSpecialtyId, validate, deleteSpecialty);

// Combinations
router.post('/api/adminCreateSeEspDoc', Admin, validateCreateCombination, validate, createCombination);
router.put('/api/adminDeleteSeEspDoc', Admin, validateCreateCombination, validate, deleteCombination);
router.get('/api/adminGetCombinaciones', Admin, getCombinations);

// Schedules
router.post('/api/adminCreateHorario', Admin, validateCreateSchedule, validate, createSchedule);
router.post('/api/adminGetHorariosXDoctor', Admin, validateCreateCombination, validate, getSchedules);
router.put('/api/adminUpdateHorario', Admin, validateCreateSchedule, validate, updateSchedule);

export default router;

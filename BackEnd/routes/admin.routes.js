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
} from '../controllers/doctors.controllers.js';
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locations.controllers.js';
import {
  createHealthInsurance,
  getHealthInsuranceList,
  deleteHealthInsurance,
  updateHealthInsurance,
} from '../controllers/health-insurance.controllers.js';
import {
  createSpecialty,
  deleteSpecialty,
} from '../controllers/specialties.controllers.js';
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

router.post('/api/admin/login', validateAdminLogin, validate, getAdminByCredentials);

// Doctor
router.post('/api/admin/doctors', Admin, validateCreateDoctor, validate, createDoctor);
router.delete('/api/admin/doctors/:id', Admin, validateDoctorId, validate, deleteDoctor);
router.put('/api/admin/doctors/:id', Admin, validateDoctorId, validate, updateDoctor);

// Location
router.post('/api/admin/locations', Admin, validateCreateLocation, validate, createLocation);
router.put('/api/admin/locations/:id', Admin, validateLocationId, validate, updateLocation);
router.delete('/api/admin/locations/:id', Admin, validateLocationId, validate, deleteLocation);

// Health Insurance
router.post('/api/admin/health-insurance', Admin, validateCreateHealthInsurance, validate, createHealthInsurance);
router.get('/api/health-insurance', getHealthInsuranceList);
router.delete('/api/admin/health-insurance/:id', Admin, validateHealthInsuranceId, validate, deleteHealthInsurance);
router.put('/api/admin/health-insurance/:id', Admin, validateHealthInsuranceId, validate, updateHealthInsurance);

// Specialty
router.post('/api/admin/specialties', Admin, validateCreateSpecialty, validate, createSpecialty);
router.delete('/api/admin/specialties/:id', Admin, validateSpecialtyId, validate, deleteSpecialty);

// Combinations
router.post('/api/admin/combinations', Admin, validateCreateCombination, validate, createCombination);
router.delete('/api/admin/combinations', Admin, validateCreateCombination, validate, deleteCombination);
router.get('/api/admin/combinations', Admin, getCombinations);

// Schedules
router.post('/api/admin/schedules', Admin, validateCreateSchedule, validate, createSchedule);
router.post('/api/admin/schedules/doctor', Admin, validateCreateCombination, validate, getSchedules);
router.put('/api/admin/schedules', Admin, validateCreateSchedule, validate, updateSchedule);

export default router;

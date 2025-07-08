import { Router } from 'express';
import { Admin, AdminOrPatient } from '../middleware/authorizeRole.js';
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
} from '../controllers/doctors.controllers.js';
import {
  createVenue,
  updateVenue,
  deleteVenue,
} from '../controllers/venues.controllers.js';
import {
  createInsurance,
  getInsurances,
  deleteInsurance,
  updateInsurance,
} from '../controllers/insurance.controllers.js';
import {
  createSpecialty,
  deleteSpecialty,
} from '../controllers/specialties.controllers.js';
const router = Router();

router.post('/api/admin', getAdmin);
//Doctor
router.post('/api/adminCreateDr', Admin, createDoctor);
router.put('/api/adminDeleteDr/:doctorId', Admin, deleteDoctor);
router.put('/api/adminUpdateDr/:doctorId', Admin, updateDoctor);
//Venue
router.post('/api/adminCreateSede', Admin, createVenue);
router.put('/api/adminUpdateSede/:venueId', Admin, updateVenue);
router.put('/api/adminDeleteSede/:venueId', Admin, deleteVenue);
//Insurance
router.post('/api/adminCreateObraSocial', Admin, createInsurance);
router.get('/api/os', getInsurances);
router.put('/api/adminDeleteOS/:insuranceId', Admin, deleteInsurance);
router.put('/api/adminUpdateOS/:insuranceId', Admin, updateInsurance);
//Specialty
router.post('/api/adminCreateEsp', Admin, createSpecialty);
router.put('/api/deleteSpecialties/:specialtyId', Admin, deleteSpecialty);
//Combinations
router.post('/api/adminCreateSeEspDoc', Admin, createSeEspDoc);
router.put('/api/adminDeleteSeEspDoc', Admin, deleteSeEspDoc); //Expects body with venueId, specialtyId, doctorId
router.get('/api/adminGetCombinaciones', Admin, getCombinaciones);
//Schedules
router.post('/api/adminCreateHorario', Admin, createHorarios);
router.post('/api/adminGetHorariosXDoctor', Admin, getHorariosXDoctor);
router.put('/api/adminUpdateHorario', Admin, updateHorarios);

export default router;

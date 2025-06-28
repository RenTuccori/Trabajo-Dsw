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
router.put('/api/adminDeleteDr/:idDoctor', Admin, deleteDoctor);
router.put('/api/adminUpdateDr/:idDoctor', Admin, updateDoctor);
//Sede
router.post('/api/adminCreateSede', Admin, createVenue);
router.put('/api/adminUpdateSede/:idSede', Admin, updateVenue);
router.put('/api/adminDeleteSede/:idSede', Admin, deleteVenue);
//ObraSocial
router.post('/api/adminCreateObraSocial', Admin, createInsurance);
router.get('/api/os', getInsurances);
router.put('/api/adminDeleteOS/:idObraSocial', Admin, deleteInsurance);
router.put('/api/adminUpdateOS/:idObraSocial', Admin, updateInsurance);
//Especialidad
router.post('/api/adminCreateEsp', Admin, createSpecialty);
router.put('/api/deleteSpecialties/:idEspecialidad', Admin, deleteSpecialty);
//Combinaciones
router.post('/api/adminCreateSeEspDoc', Admin, createSeEspDoc);
router.put('/api/adminDeleteSeEspDoc', Admin, deleteSeEspDoc); //Espera body de idSede, idEspecialidad, idDoctor
router.get('/api/adminGetCombinaciones', Admin, getCombinaciones);
//Horarios
router.post('/api/adminCreateHorario', Admin, createHorarios);
router.post('/api/adminGetHorariosXDoctor', Admin, getHorariosXDoctor);
router.put('/api/adminUpdateHorario', Admin, updateHorarios);

export default router;

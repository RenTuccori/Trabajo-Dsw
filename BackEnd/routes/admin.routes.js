import { Router } from "express";
import {Admin, AdminOrPaciente} from '../middleware/authorizeRole.js';
import { getAdmin, createSeEspDoc, deleteSeEspDoc, getCombinaciones, createHorarios, getHorariosXDoctor, updateHorarios } from "../controllers/admin.controllers.js";
import { createDoctor, deleteDoctor, updateDoctor } from "../controllers/doctores.controllers.js";
import { createSede, updateSede, deleteSede } from "../controllers/sedes.controllers.js";
import { createObraSocial, getObrasSociales, deleteObraSocial, updateObraSocial } from "../controllers/obrassociales.controller.js";
import { createSpecialty, deleteSpecialty } from "../controllers/especialidades.controllers.js";
const router = Router();

router.post("/api/admin", getAdmin);
//Doctor
router.post('/api/adminCreateDr', Admin, createDoctor);
router.put("/api/adminDeleteDr/:idDoctor", Admin, deleteDoctor);
router.put('/api/adminUpdateDr/:idDoctor',Admin, updateDoctor);
//Sede
router.post('/api/adminCreateSede',Admin, createSede);
router.put('/api/adminUpdateSede/:idSede',Admin, updateSede);
router.put("/api/adminDeleteSede/:idSede",Admin, deleteSede);
//ObraSocial
router.post('/api/adminCreateObraSocial',Admin, createObraSocial);
router.get('/api/os', getObrasSociales);
router.put('/api/adminDeleteOS/:idObraSocial',Admin, deleteObraSocial);
router.put('/api/adminUpdateOS/:idObraSocial',Admin, updateObraSocial);
//Especialidad
router.post('/api/adminCreateEsp',Admin, createSpecialty);
router.put('/api/deleteSpecialties/:idEspecialidad',Admin, deleteSpecialty);
//Combinaciones
router.post('/api/adminCreateSeEspDoc',Admin, createSeEspDoc);
router.put('/api/adminDeleteSeEspDoc',Admin, deleteSeEspDoc); //Espera body de idSede, idEspecialidad, idDoctor
router.get('/api/adminGetCombinaciones',Admin, getCombinaciones);
//Horarios
router.post('/api/adminCreateHorario',Admin, createHorarios);
router.post('/api/adminGetHorariosXDoctor',Admin, getHorariosXDoctor);
router.put('/api/adminUpdateHorario',Admin, updateHorarios);

export default router;
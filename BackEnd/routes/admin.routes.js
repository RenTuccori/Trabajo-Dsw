import { Router } from "express";
import { getAdmin, createSeEspDoc } from "../controllers/admin.controllers.js";
import { createDoctor, deleteDoctor, updateDoctor } from "../controllers/doctores.controllers.js";
import { createSede, updateSede, deleteSede } from "../controllers/sedes.controllers.js";
import { createObraSocial, getObrasSociales, deleteObraSocial, updateObraSocial } from "../controllers/obrassociales.controller.js";
import { createSpecialty, deleteSpecialty } from "../controllers/especialidades.controllers.js";
const router = Router();

router.post("/api/admin", getAdmin);
//Doctor
router.post('/api/adminCreateDr', createDoctor);
router.delete("/api/adminDeleteDr/:idDoctor", deleteDoctor);
router.put('/api/adminUpdateDr/:idDoctor', updateDoctor);
//Sede
router.post('/api/adminCreateSede', createSede);
router.put('/api/adminUpdateSede/:idSede', updateSede);
router.delete("/api/adminDeleteSede/:idSede", deleteSede);
//ObraSocial
router.post('/api/adminCreateObraSocial', createObraSocial);
router.get('/api/os', getObrasSociales);
router.delete("/api/adminDeleteOS/:idObraSocial", deleteObraSocial);
router.put('/api/adminUpdateOS/:idObraSocial', updateObraSocial);
//Especialidad
router.post('/api/adminCreateEsp', createSpecialty);
router.delete('/api/deleteSpecialties/:idEspecialidad', deleteSpecialty);
//Combinaciones
router.post('/api/adminCreateSeEspDoc', createSeEspDoc);


export default router;
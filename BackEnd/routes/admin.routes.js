import { Router } from "express";
import { getAdmin, createSeEspDoc } from "../controllers/admin.controllers.js";
import { createDoctor, deleteDoctor, updateDoctor } from "../controllers/doctores.controllers.js";
import { createSede, updateSede, deleteSede } from "../controllers/sedes.controllers.js";
import { createObraSocial } from "../controllers/obrassociales.controller.js";

const router = Router();

router.post("/api/admin", getAdmin);
router.post('/api/adminCreateSeEspDoc', createSeEspDoc);
router.post('/api/adminCreateDr', createDoctor);
router.delete("/api/adminDeleteDr/:idDoctor", deleteDoctor);
router.put('/api/adminUpdateDr/:idDoctor', updateDoctor);
router.post('/api/adminCreateSede', createSede);
router.put('/api/adminUpdateSede/:idSede', updateSede);
router.post('/api/adminCreateObraSocial', createObraSocial);
router.delete("/api/adminDeleteSede/:idSede", deleteSede);



export default router;
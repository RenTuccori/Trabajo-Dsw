import { Router } from "express";
import { getAdmin } from "../controllers/admin.controllers.js";

const router = Router();

router.post("/api/admin", getAdmin);

export default router;
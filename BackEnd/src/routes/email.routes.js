import { Router } from 'express';
import { sendEmail } from '../src/controllers/email.controllers.js';

const router = Router();

// Ruta para enviar correos
router.post("/api/send-email", sendEmail);

export default router;

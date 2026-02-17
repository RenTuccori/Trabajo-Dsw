import { Router } from 'express';
import { sendEmail } from '../controllers/email.controllers.js';
import { Patient } from '../middleware/authorizeRole.js';
import { validateSendEmail } from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/api/send-email', Patient, validateSendEmail, validate, sendEmail);

export default router;

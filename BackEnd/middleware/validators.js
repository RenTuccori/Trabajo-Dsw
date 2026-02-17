import { body, param, query } from 'express-validator';

// === USERS ===
export const validateUserLogin = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI must be a valid number (minimum 7 digits).'),
  body('fechaNacimiento').isDate().withMessage('Date of birth must be a valid date (YYYY-MM-DD).'),
];

export const validateUserDni = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI must be a valid number.'),
];

export const validateCreateUser = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI must be a valid number.'),
  body('fechaNacimiento').isDate().withMessage('Date of birth is required.'),
  body('nombre').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }),
  body('apellido').trim().notEmpty().withMessage('Last name is required.').isLength({ max: 100 }),
  body('email').optional({ nullable: true }).isEmail().withMessage('Email must be valid.'),
  body('telefono').optional({ nullable: true }).isLength({ max: 20 }),
  body('direccion').optional({ nullable: true }).isLength({ max: 100 }),
];

export const validateUpdateUser = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI is required.'),
  body('nombre').optional().trim().notEmpty().isLength({ max: 100 }),
  body('apellido').optional().trim().notEmpty().isLength({ max: 100 }),
  body('email').optional({ nullable: true }).isEmail().withMessage('Email must be valid.'),
];

// === LOCATIONS ===
export const validateCreateLocation = [
  body('nombre').trim().notEmpty().withMessage('Location name is required.').isLength({ max: 100 }),
  body('direccion').trim().notEmpty().withMessage('Location address is required.').isLength({ max: 100 }),
];

export const validateLocationId = [
  param('idSede').isInt({ min: 1 }).withMessage('Location ID must be a valid number.'),
];

// === SPECIALTIES ===
export const validateCreateSpecialty = [
  body('nombre').trim().notEmpty().withMessage('Specialty name is required.').isLength({ max: 100 }),
];

export const validateSpecialtyId = [
  param('idEspecialidad').isInt({ min: 1 }).withMessage('Specialty ID must be a valid number.'),
];

// === DOCTORS ===
export const validateDoctorLogin = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI must be a valid number.'),
  body('contra').notEmpty().withMessage('Password is required.'),
];

export const validateCreateDoctor = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI must be a valid number.'),
  body('duracionTurno').isInt({ min: 1 }).withMessage('Appointment duration must be a positive number.'),
  body('contra').notEmpty().withMessage('Password is required.').isLength({ min: 3, max: 45 }),
];

export const validateDoctorId = [
  param('idDoctor').isInt({ min: 1 }).withMessage('Doctor ID must be a valid number.'),
];

export const validateUpdateDoctor = [
  param('idDoctor').isInt({ min: 1 }).withMessage('Doctor ID must be a valid number.'),
  body('duracionTurno').isInt({ min: 1 }).withMessage('Appointment duration must be a positive number.'),
  body('contra').notEmpty().withMessage('Password is required.'),
];

// === APPOINTMENTS ===
export const validateCreateAppointment = [
  body('idPaciente').isInt({ min: 1 }).withMessage('Patient ID is required.'),
  body('fechaYHora').notEmpty().withMessage('Date and time are required.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
  body('idDoctor').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
  body('idSede').isInt({ min: 1 }).withMessage('Location ID is required.'),
];

export const validateAppointmentAction = [
  body('idTurno').isInt({ min: 1 }).withMessage('Appointment ID is required.'),
];

export const validateAppointmentId = [
  param('id').isInt({ min: 1 }).withMessage('Appointment ID must be a valid number.'),
];

// === HEALTH INSURANCE ===
export const validateCreateHealthInsurance = [
  body('nombre').trim().notEmpty().withMessage('Health insurance name is required.').isLength({ max: 100 }),
];

export const validateHealthInsuranceId = [
  param('idObraSocial').isInt({ min: 1 }).withMessage('Health insurance ID must be a valid number.'),
];

export const validateUpdateHealthInsurance = [
  param('idObraSocial').isInt({ min: 1 }).withMessage('Health insurance ID must be a valid number.'),
  body('nombre').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }),
];

// === ADMIN ===
export const validateAdminLogin = [
  body('usuario').trim().notEmpty().withMessage('Username is required.'),
  body('contra').notEmpty().withMessage('Password is required.'),
];

// === COMBINATIONS ===
export const validateCreateCombination = [
  body('idSede').isInt({ min: 1 }).withMessage('Location ID is required.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
  body('idDoctor').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
];

// === SCHEDULES ===
export const validateCreateSchedule = [
  body('idSede').isInt({ min: 1 }).withMessage('Location ID is required.'),
  body('idDoctor').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
  body('dia').trim().notEmpty().withMessage('Day is required.'),
  body('hora_inicio').matches(/^\d{2}:\d{2}/).withMessage('Start time must have format HH:MM.'),
  body('hora_fin').matches(/^\d{2}:\d{2}/).withMessage('End time must have format HH:MM.'),
];

// === AVAILABLE SCHEDULES ===
export const validateAvailableDates = [
  body('idDoctor').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
  body('idSede').isInt({ min: 1 }).withMessage('Location ID is required.'),
];

export const validateAvailableSchedules = [
  body('idDoctor').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
  body('idSede').isInt({ min: 1 }).withMessage('Location ID is required.'),
  body('fecha').isDate().withMessage('Date must be valid.'),
];

// === PATIENTS ===
export const validateCreatePatient = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI must be a valid number.'),
];

// === REUSABLE BODY / PARAM VALIDATORS ===
export const validateLocationIdBody = [
  body('idSede').isInt({ min: 1 }).withMessage('Location ID is required.'),
];

export const validateLocationSpecBody = [
  body('idSede').isInt({ min: 1 }).withMessage('Location ID is required.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
];

export const validatePatientIdParam = [
  param('idPaciente').isInt({ min: 1 }).withMessage('Patient ID must be a valid number.'),
];

export const validateDoctorIdBody = [
  body('idDoctor').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
];

export const validateDniParam = [
  param('dni').isInt({ min: 1000000 }).withMessage('DNI must be a valid number.'),
];

// === STUDIES ===
export const validateStudyUpload = [
  body('idPaciente').isInt({ min: 1 }).withMessage('Patient ID is required.'),
  body('fechaRealizacion').isDate().withMessage('Completion date must be valid.'),
];

export const validateStudyId = [
  param('idEstudio').isInt({ min: 1 }).withMessage('Study ID must be a valid number.'),
];

// === EMAIL ===
export const validateSendEmail = [
  body('to').isEmail().withMessage('Recipient email address is required.'),
  body('subject').trim().notEmpty().withMessage('Subject is required.'),
  body('html').trim().notEmpty().withMessage('Email content is required.'),
];

import { body, param, query } from 'express-validator';

// === USERS ===
export const validateUserLogin = [
  body('nationalId').isInt({ min: 1000000 }).withMessage('National ID must be a valid number (minimum 7 digits).'),
  body('birthDate').isDate().withMessage('Date of birth must be a valid date (YYYY-MM-DD).'),
];

export const validateUserNationalId = [
  body('nationalId').isInt({ min: 1000000 }).withMessage('National ID must be a valid number.'),
];

export const validateCreateUser = [
  body('nationalId').isInt({ min: 1000000 }).withMessage('National ID must be a valid number.'),
  body('birthDate').isDate().withMessage('Date of birth is required.'),
  body('firstName').trim().notEmpty().withMessage('First name is required.').isLength({ max: 100 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required.').isLength({ max: 100 }),
  body('email').optional({ nullable: true }).isEmail().withMessage('Email must be valid.'),
  body('phone').optional({ nullable: true }).isLength({ max: 20 }),
  body('address').optional({ nullable: true }).isLength({ max: 100 }),
];

export const validateUpdateUser = [
  body('nationalId').isInt({ min: 1000000 }).withMessage('National ID is required.'),
  body('firstName').optional().trim().notEmpty().isLength({ max: 100 }),
  body('lastName').optional().trim().notEmpty().isLength({ max: 100 }),
  body('email').optional({ nullable: true }).isEmail().withMessage('Email must be valid.'),
];

// === LOCATIONS ===
export const validateCreateLocation = [
  body('name').trim().notEmpty().withMessage('Location name is required.').isLength({ max: 100 }),
  body('address').trim().notEmpty().withMessage('Location address is required.').isLength({ max: 100 }),
];

export const validateLocationId = [
  param('id').isInt({ min: 1 }).withMessage('Location ID must be a valid number.'),
];

// === SPECIALTIES ===
export const validateCreateSpecialty = [
  body('name').trim().notEmpty().withMessage('Specialty name is required.').isLength({ max: 100 }),
];

export const validateSpecialtyId = [
  param('id').isInt({ min: 1 }).withMessage('Specialty ID must be a valid number.'),
];

// === DOCTORS ===
export const validateDoctorLogin = [
  body('nationalId').isInt({ min: 1000000 }).withMessage('National ID must be a valid number.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

export const validateCreateDoctor = [
  body('nationalId').isInt({ min: 1000000 }).withMessage('National ID must be a valid number.'),
  body('appointmentDuration').isInt({ min: 1 }).withMessage('Appointment duration must be a positive number.'),
  body('password').notEmpty().withMessage('Password is required.').isLength({ min: 3, max: 45 }),
];

export const validateDoctorId = [
  param('id').isInt({ min: 1 }).withMessage('Doctor ID must be a valid number.'),
];

export const validateUpdateDoctor = [
  param('id').isInt({ min: 1 }).withMessage('Doctor ID must be a valid number.'),
  body('appointmentDuration').isInt({ min: 1 }).withMessage('Appointment duration must be a positive number.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

// === APPOINTMENTS ===
export const validateCreateAppointment = [
  body('patientId').isInt({ min: 1 }).withMessage('Patient ID is required.'),
  body('dateTime').notEmpty().withMessage('Date and time are required.'),
  body('specialtyId').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
  body('doctorId').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
  body('locationId').isInt({ min: 1 }).withMessage('Location ID is required.'),
];

export const validateAppointmentAction = [
  body('id').isInt({ min: 1 }).withMessage('Appointment ID is required.'),
];

export const validateAppointmentId = [
  param('id').isInt({ min: 1 }).withMessage('Appointment ID must be a valid number.'),
];

// === HEALTH INSURANCE ===
export const validateCreateHealthInsurance = [
  body('name').trim().notEmpty().withMessage('Health insurance name is required.').isLength({ max: 100 }),
];

export const validateHealthInsuranceId = [
  param('id').isInt({ min: 1 }).withMessage('Health insurance ID must be a valid number.'),
];

export const validateUpdateHealthInsurance = [
  param('id').isInt({ min: 1 }).withMessage('Health insurance ID must be a valid number.'),
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }),
];

// === ADMIN ===
export const validateAdminLogin = [
  body('username').trim().notEmpty().withMessage('Username is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

// === COMBINATIONS ===
export const validateCreateCombination = [
  body('locationId').isInt({ min: 1 }).withMessage('Location ID is required.'),
  body('specialtyId').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
  body('doctorId').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
];

// === SCHEDULES ===
export const validateCreateSchedule = [
  body('locationId').isInt({ min: 1 }).withMessage('Location ID is required.'),
  body('doctorId').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
  body('specialtyId').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
  body('day').trim().notEmpty().withMessage('Day is required.'),
  body('startTime').matches(/^\d{2}:\d{2}/).withMessage('Start time must have format HH:MM.'),
  body('endTime').matches(/^\d{2}:\d{2}/).withMessage('End time must have format HH:MM.'),
];

// === AVAILABLE SCHEDULES ===
export const validateAvailableDates = [
  body('doctorId').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
  body('specialtyId').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
  body('locationId').isInt({ min: 1 }).withMessage('Location ID is required.'),
];

export const validateAvailableSchedules = [
  body('doctorId').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
  body('specialtyId').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
  body('locationId').isInt({ min: 1 }).withMessage('Location ID is required.'),
  body('fecha').isDate().withMessage('Date must be valid.'),
];

// === PATIENTS ===
export const validateCreatePatient = [
  body('nationalId').isInt({ min: 1000000 }).withMessage('National ID must be a valid number.'),
];

// === REUSABLE BODY / PARAM VALIDATORS ===
export const validateLocationIdBody = [
  body('locationId').isInt({ min: 1 }).withMessage('Location ID is required.'),
];

export const validateLocationSpecBody = [
  body('locationId').isInt({ min: 1 }).withMessage('Location ID is required.'),
  body('specialtyId').isInt({ min: 1 }).withMessage('Specialty ID is required.'),
];

export const validatePatientIdParam = [
  param('patientId').isInt({ min: 1 }).withMessage('Patient ID must be a valid number.'),
];

export const validateDoctorIdBody = [
  body('doctorId').isInt({ min: 1 }).withMessage('Doctor ID is required.'),
];

export const validateNationalIdParam = [
  param('nationalId').isInt({ min: 1000000 }).withMessage('National ID must be a valid number.'),
];

// === STUDIES ===
export const validateStudyUpload = [
  body('patientId').isInt({ min: 1 }).withMessage('Patient ID is required.'),
  body('performanceDate').isDate().withMessage('Completion date must be valid.'),
];

export const validateStudyId = [
  param('id').isInt({ min: 1 }).withMessage('Study ID must be a valid number.'),
];

// === EMAIL ===
export const validateSendEmail = [
  body('to').isEmail().withMessage('Recipient email address is required.'),
  body('subject').trim().notEmpty().withMessage('Subject is required.'),
  body('html').trim().notEmpty().withMessage('Email content is required.'),
];

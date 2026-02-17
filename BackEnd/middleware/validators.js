import { body, param, query } from 'express-validator';

// === USUARIOS ===
export const validateUserLogin = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI debe ser un número válido (mínimo 7 dígitos).'),
  body('fechaNacimiento').isDate().withMessage('Fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD).'),
];

export const validateUserDni = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI debe ser un número válido.'),
];

export const validateCreateUser = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI debe ser un número válido.'),
  body('fechaNacimiento').isDate().withMessage('Fecha de nacimiento es requerida.'),
  body('nombre').trim().notEmpty().withMessage('Nombre es requerido.').isLength({ max: 100 }),
  body('apellido').trim().notEmpty().withMessage('Apellido es requerido.').isLength({ max: 100 }),
  body('email').optional({ nullable: true }).isEmail().withMessage('Email debe ser válido.'),
  body('telefono').optional({ nullable: true }).isLength({ max: 20 }),
  body('direccion').optional({ nullable: true }).isLength({ max: 100 }),
];

export const validateUpdateUser = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI es requerido.'),
  body('nombre').optional().trim().notEmpty().isLength({ max: 100 }),
  body('apellido').optional().trim().notEmpty().isLength({ max: 100 }),
  body('email').optional({ nullable: true }).isEmail().withMessage('Email debe ser válido.'),
];

// === SEDES ===
export const validateCreateSede = [
  body('nombre').trim().notEmpty().withMessage('Nombre de la sede es requerido.').isLength({ max: 100 }),
  body('direccion').trim().notEmpty().withMessage('Dirección de la sede es requerida.').isLength({ max: 100 }),
];

export const validateSedeId = [
  param('idSede').isInt({ min: 1 }).withMessage('ID de sede debe ser un número válido.'),
];

// === ESPECIALIDADES ===
export const validateCreateEspecialidad = [
  body('nombre').trim().notEmpty().withMessage('Nombre de la especialidad es requerido.').isLength({ max: 100 }),
];

export const validateEspecialidadId = [
  param('idEspecialidad').isInt({ min: 1 }).withMessage('ID de especialidad debe ser un número válido.'),
];

// === DOCTORES ===
export const validateDoctorLogin = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI debe ser un número válido.'),
  body('contra').notEmpty().withMessage('Contraseña es requerida.'),
];

export const validateCreateDoctor = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI debe ser un número válido.'),
  body('duracionTurno').isInt({ min: 1 }).withMessage('Duración del turno debe ser un número positivo.'),
  body('contra').notEmpty().withMessage('Contraseña es requerida.').isLength({ min: 3, max: 45 }),
];

export const validateDoctorId = [
  param('idDoctor').isInt({ min: 1 }).withMessage('ID de doctor debe ser un número válido.'),
];

export const validateUpdateDoctor = [
  param('idDoctor').isInt({ min: 1 }).withMessage('ID de doctor debe ser un número válido.'),
  body('duracionTurno').isInt({ min: 1 }).withMessage('Duración del turno debe ser un número positivo.'),
  body('contra').notEmpty().withMessage('Contraseña es requerida.'),
];

// === TURNOS ===
export const validateCreateTurno = [
  body('idPaciente').isInt({ min: 1 }).withMessage('ID de paciente es requerido.'),
  body('fechaYHora').notEmpty().withMessage('Fecha y hora son requeridas.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('ID de especialidad es requerido.'),
  body('idDoctor').isInt({ min: 1 }).withMessage('ID de doctor es requerido.'),
  body('idSede').isInt({ min: 1 }).withMessage('ID de sede es requerido.'),
];

export const validateTurnoAction = [
  body('idTurno').isInt({ min: 1 }).withMessage('ID de turno es requerido.'),
];

export const validateTurnoId = [
  param('id').isInt({ min: 1 }).withMessage('ID de turno debe ser un número válido.'),
];

// === OBRAS SOCIALES ===
export const validateCreateObraSocial = [
  body('nombre').trim().notEmpty().withMessage('Nombre de la obra social es requerido.').isLength({ max: 100 }),
];

export const validateObraSocialId = [
  param('idObraSocial').isInt({ min: 1 }).withMessage('ID de obra social debe ser un número válido.'),
];

export const validateUpdateObraSocial = [
  param('idObraSocial').isInt({ min: 1 }).withMessage('ID de obra social debe ser un número válido.'),
  body('nombre').trim().notEmpty().withMessage('Nombre es requerido.').isLength({ max: 100 }),
];

// === ADMIN ===
export const validateAdminLogin = [
  body('usuario').trim().notEmpty().withMessage('Usuario es requerido.'),
  body('contra').notEmpty().withMessage('Contraseña es requerida.'),
];

// === COMBINACIONES ===
export const validateCreateCombinacion = [
  body('idSede').isInt({ min: 1 }).withMessage('ID de sede es requerido.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('ID de especialidad es requerido.'),
  body('idDoctor').isInt({ min: 1 }).withMessage('ID de doctor es requerido.'),
];

// === HORARIOS ===
export const validateCreateHorario = [
  body('idSede').isInt({ min: 1 }).withMessage('ID de sede es requerido.'),
  body('idDoctor').isInt({ min: 1 }).withMessage('ID de doctor es requerido.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('ID de especialidad es requerido.'),
  body('dia').trim().notEmpty().withMessage('Día es requerido.'),
  body('hora_inicio').matches(/^\d{2}:\d{2}/).withMessage('Hora de inicio debe tener formato HH:MM.'),
  body('hora_fin').matches(/^\d{2}:\d{2}/).withMessage('Hora de fin debe tener formato HH:MM.'),
];

// === HORARIOS DISPONIBLES ===
export const validateFechasDisp = [
  body('idDoctor').isInt({ min: 1 }).withMessage('ID de doctor es requerido.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('ID de especialidad es requerido.'),
  body('idSede').isInt({ min: 1 }).withMessage('ID de sede es requerido.'),
];

export const validateHorariosDisp = [
  body('idDoctor').isInt({ min: 1 }).withMessage('ID de doctor es requerido.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('ID de especialidad es requerido.'),
  body('idSede').isInt({ min: 1 }).withMessage('ID de sede es requerido.'),
  body('fecha').isDate().withMessage('Fecha debe ser válida.'),
];

// === PACIENTES ===
export const validateCreatePaciente = [
  body('dni').isInt({ min: 1000000 }).withMessage('DNI debe ser un número válido.'),
];

// === REUSABLE BODY / PARAM VALIDATORS ===
export const validateSedeIdBody = [
  body('idSede').isInt({ min: 1 }).withMessage('ID de sede es requerido.'),
];

export const validateSedeEspBody = [
  body('idSede').isInt({ min: 1 }).withMessage('ID de sede es requerido.'),
  body('idEspecialidad').isInt({ min: 1 }).withMessage('ID de especialidad es requerido.'),
];

export const validatePacienteIdParam = [
  param('idPaciente').isInt({ min: 1 }).withMessage('ID de paciente debe ser un número válido.'),
];

export const validateDoctorIdBody = [
  body('idDoctor').isInt({ min: 1 }).withMessage('ID de doctor es requerido.'),
];

export const validateDniParam = [
  param('dni').isInt({ min: 1000000 }).withMessage('DNI debe ser un número válido.'),
];

// === ESTUDIOS ===
export const validateEstudioUpload = [
  body('idPaciente').isInt({ min: 1 }).withMessage('ID de paciente es requerido.'),
  body('fechaRealizacion').isDate().withMessage('Fecha de realización debe ser válida.'),
];

export const validateEstudioId = [
  param('idEstudio').isInt({ min: 1 }).withMessage('ID de estudio debe ser un número válido.'),
];

// === EMAIL ===
export const validateSendEmail = [
  body('to').isEmail().withMessage('Dirección de email destinatario es requerida.'),
  body('subject').trim().notEmpty().withMessage('Asunto es requerido.'),
  body('html').trim().notEmpty().withMessage('Contenido del email es requerido.'),
];

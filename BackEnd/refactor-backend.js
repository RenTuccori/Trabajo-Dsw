const fs = require('fs');
const path = require('path');

// Mapeo de términos en español a inglés
const translations = {
  // Variables y funciones generales
  getPacientes: 'getPatients',
  createPaciente: 'createPatient',
  updatePaciente: 'updatePatient',
  deletePaciente: 'deletePatient',
  getPacienteById: 'getPatientById',
  getPacienteDni: 'getPatientByDni',
  pacientes: 'patients',
  paciente: 'patient',

  getDoctores: 'getDoctors',
  createDoctor: 'createDoctor',
  updateDoctor: 'updateDoctor',
  deleteDoctor: 'deleteDoctor',
  getDoctorById: 'getDoctorById',
  doctores: 'doctors',
  doctor: 'doctor',

  getEspecialidades: 'getSpecialties',
  createEspecialidad: 'createSpecialty',
  updateEspecialidad: 'updateSpecialty',
  deleteEspecialidad: 'deleteSpecialty',
  getEspecialidadById: 'getSpecialtyById',
  especialidades: 'specialties',
  especialidad: 'specialty',

  getEstudios: 'getStudies',
  createEstudio: 'createStudy',
  updateEstudio: 'updateStudy',
  deleteEstudio: 'deleteStudy',
  getEstudioById: 'getStudyById',
  getEstudiosByDoctor: 'getStudiesByDoctor',
  getEstudiosByPaciente: 'getStudiesByPatient',
  uploadEstudio: 'uploadStudy',
  downloadEstudio: 'downloadStudy',
  estudios: 'studies',
  estudio: 'study',

  getHorarios: 'getSchedules',
  createHorario: 'createSchedule',
  updateHorario: 'updateSchedule',
  deleteHorario: 'deleteSchedule',
  getHorarioById: 'getScheduleById',
  getFechasDispTodos: 'getAllAvailableDates',
  getHorariosDisp: 'getAvailableSchedules',
  horarios: 'schedules',
  horario: 'schedule',

  getObrasSociales: 'getInsurances',
  createObraSocial: 'createInsurance',
  updateObraSocial: 'updateInsurance',
  deleteObraSocial: 'deleteInsurance',
  getObraSocialById: 'getInsuranceById',
  obrassociales: 'insurances',
  obrasocial: 'insurance',
  obra_social: 'insurance',

  getSedes: 'getVenues',
  createSede: 'createVenue',
  updateSede: 'updateVenue',
  deleteSede: 'deleteVenue',
  getSedeById: 'getVenueById',
  sedes: 'venues',
  sede: 'venue',

  getTurnos: 'getAppointments',
  createTurno: 'createAppointment',
  updateTurno: 'updateAppointment',
  deleteTurno: 'deleteAppointment',
  getTurnoById: 'getAppointmentById',
  getTurnosPaciente: 'getPatientAppointments',
  getTurnosDoctor: 'getDoctorAppointments',
  getTurnosByFecha: 'getAppointmentsByDate',
  confirmarTurno: 'confirmAppointment',
  cancelarTurno: 'cancelAppointment',
  turnos: 'appointments',
  turno: 'appointment',

  getUsuarios: 'getUsers',
  createUser: 'createUser',
  updateUser: 'updateUser',
  deleteUser: 'deleteUser',
  getUserById: 'getUserById',
  getUserDni: 'getUserByDni',
  usuarios: 'users',
  usuario: 'user',

  // Campos de base de datos comunes
  id_paciente: 'patient_id',
  id_doctor: 'doctor_id',
  id_especialidad: 'specialty_id',
  id_sede: 'venue_id',
  id_turno: 'appointment_id',
  id_estudio: 'study_id',
  id_horario: 'schedule_id',
  id_obra_social: 'insurance_id',
  id_usuario: 'user_id',

  nombre_especialidad: 'specialty_name',
  nombre_sede: 'venue_name',
  nombre_obra_social: 'insurance_name',
  fecha_turno: 'appointment_date',
  fecha_nacimiento: 'birth_date',
  fecha_creacion: 'creation_date',
  fecha_realizacion: 'completion_date',
  hora_inicio: 'start_time',
  hora_fin: 'end_time',

  // Estados y otros campos
  estado_turno: 'appointment_status',
  confirmado: 'confirmed',
  cancelado: 'cancelled',
  pendiente: 'pending',
  activo: 'active',
  inactivo: 'inactive',
  descripcion: 'description',
  observaciones: 'observations',
  telefono: 'phone',
  direccion: 'address',
  email: 'email',
  password: 'password',
  dni: 'dni',
  apellido: 'last_name',
  nombre: 'first_name',
};

function replaceInFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let hasChanges = false;

    // Aplicar reemplazos de forma inteligente
    for (const [spanish, english] of Object.entries(replacements)) {
      // Reemplazar nombres de variables y funciones (completos)
      const wordBoundaryRegex = new RegExp(
        `\\b${spanish.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`,
        'g'
      );
      const newContent = content.replace(wordBoundaryRegex, english);
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath, extensions = ['.js', '.jsx']) {
  let totalFiles = 0;
  let modifiedFiles = 0;

  function processDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') {
        processDir(itemPath);
      } else if (
        stat.isFile() &&
        extensions.some((ext) => item.endsWith(ext))
      ) {
        totalFiles++;
        if (replaceInFile(itemPath, translations)) {
          modifiedFiles++;
        }
      }
    }
  }

  processDir(dirPath);
}

// Procesar todos los archivos del backend
console.log('Starting backend refactoring...');
processDirectory('./');
console.log('Backend refactoring completed!');

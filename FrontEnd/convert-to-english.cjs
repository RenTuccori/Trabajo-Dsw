const fs = require('fs');
const path = require('path');

// Diccionario de traducciones de español a inglés
const translations = {
  // Variables y propiedades
  'sedes': 'venues',
  'especialidades': 'specialties', 
  'doctores': 'doctors',
  'fechas': 'dates',
  'horarios': 'schedules',
  'obrasSociales': 'healthInsurances',
  'obraSociales': 'healthInsurances',
  'usuario': 'user',
  'usuarios': 'users',
  'paciente': 'patient',
  'pacientes': 'patients',
  'turno': 'appointment',
  'turnos': 'appointments',
  'nombre': 'name',
  'apellido': 'lastName',
  'direccion': 'address',
  'telefono': 'phone',
  'email': 'email',
  'fechaNacimiento': 'birthDate',
  'contra': 'password',
  'dni': 'dni', // Se mantiene
  'idSede': 'venueId',
  'idEspecialidad': 'specialtyId',
  'idDoctor': 'doctorId',
  'idPaciente': 'patientId',
  'idTurno': 'appointmentId',
  'idObraSocial': 'healthInsuranceId',
  'fechaYHora': 'dateAndTime',
  'fechaCancelacion': 'cancellationDate',
  'fechaConfirmacion': 'confirmationDate',
  'estado': 'status',
  'duracionTurno': 'appointmentDuration',
  
  // Nombres de variables de estado
  'selectedSede': 'selectedVenue',
  'selectedEspecialidad': 'selectedSpecialty',
  'selectedDoctor': 'selectedDoctor',
  'selectedFecha': 'selectedDate',
  'selectedHorario': 'selectedSchedule',
  'formatedFecha': 'formattedDate',
  'nombreEspecialidad': 'specialtyName',
  'nombreDoctor': 'doctorName',
  'apellidoDoctor': 'doctorLastName',
  'nombreSede': 'venueName',
  'direccionSede': 'venueAddress',
  'idPacienteCreado': 'createdPatientId',
  'usuarioDni': 'userByDni',
  'mailUsuario': 'userEmail',
  
  // Funciones
  'ObtenerSedes': 'getVenues',
  'ObtenerEspecialidades': 'getSpecialties',
  'ObtenerDoctores': 'getDoctors',
  'ObtenerFechas': 'getDates',
  'ObtenerHorarios': 'getSchedules',
  'ObtenerObraSociales': 'getHealthInsurances',
  'ObtenerOS': 'getHealthInsurances',
  'ActualizarUsuario': 'updateUser',
  'CrearUsuario': 'createUser',
  'CrearPaciente': 'createPatient',
  'CrearTurno': 'createAppointment',
  'ObtenerPacienteDni': 'getPatientByDni',
  'ObtenerTurnosPaciente': 'getPatientAppointments',
  'ConfirmarTurno': 'confirmAppointment',
  'CancelarTurno': 'cancelAppointment',
  'ObtenerUsuarioDni': 'getUserByDni',
  'MandarMail': 'sendEmail',
  'ObtenerDoctorId': 'getDoctorById',
  'ObtenerEspecialidadId': 'getSpecialtyById',
  'ObtenerSedeId': 'getVenueById',
  'crearNuevaSede': 'createNewVenue',
  'crearEspecialidad': 'createSpecialty',
  'crearObraSocial': 'createHealthInsurance',
  'borrarSede': 'deleteVenue',
  'borrarEspecialidad': 'deleteSpecialty',
  'borrarObraSocial': 'deleteHealthInsurance',
  'borrarDoctor': 'deleteDoctor',
  'actualizarDoctor': 'updateDoctor',
  'actualizarObraSocial': 'updateHealthInsurance',
  'actualizarUsuario': 'updateUser',
  'CreaDoctor': 'createDoctor',
  'ObtenerDoctorPorId': 'getDoctorById',
  'ObtenerEspecialidadesDisponibles': 'getAvailableSpecialties',
  'crearSedEspDoc': 'createVenueSpecialtyDoctor',
  'borrarSedEspDoc': 'deleteVenueSpecialtyDoctor',
  'obtenerCombinaciones': 'getCombinations',
  'crearHorarios': 'createSchedules',
  'obtenerHorariosXDoctor': 'getDoctorSchedules',
  'actualizarHorarios': 'updateSchedules',
  'combinaciones': 'combinations',
  'horariosDoctor': 'doctorSchedules',
  
  // Setters
  'setSedes': 'setVenues',
  'setEspecialidades': 'setSpecialties',
  'setDoctores': 'setDoctors',
  'setFechas': 'setDates',
  'setHorarios': 'setSchedules',
  'setObrasSociales': 'setHealthInsurances',
  'setUsuario': 'setUser',
  'setIdSede': 'setVenueId',
  'setIdEspecialidad': 'setSpecialtyId',
  'setIdDoctor': 'setDoctorId',
  'setIdPaciente': 'setPatientId',
  'setEstado': 'setStatus',
  'setFechaYHora': 'setDateAndTime',
  'setFechaCancelacion': 'setCancellationDate',
  'setFechaConfirmacion': 'setConfirmationDate',
  'setTurnos': 'setAppointments',
  'setUsuarioDni': 'setUserByDni',
  'setMailUsuario': 'setUserEmail',
  'setNombreEspecialidad': 'setSpecialtyName',
  'setNombreDoctor': 'setDoctorName',
  'setApellidoDoctor': 'setDoctorLastName',
  'setNombreSede': 'setVenueName',
  'setDireccionSede': 'setVenueAddress',
  'setidPacienteCreado': 'setCreatedPatientId',
  'setSelectedSede': 'setSelectedVenue',
  'setSelectedEspecialidad': 'setSelectedSpecialty',
  'setSelectedFecha': 'setSelectedDate',
  'setSelectedHorario': 'setSelectedSchedule',
  'setFormatedFecha': 'setFormattedDate',
  'setCombinaciones': 'setCombinations',
  'setHorariosDoctor': 'setDoctorSchedules',
};

function convertFileToEnglish(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Aplicar traducciones
    for (const [spanish, english] of Object.entries(translations)) {
      const regex = new RegExp(`\\b${spanish}\\b`, 'g');
      if (content.match(regex)) {
        content = content.replace(regex, english);
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Converted: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let totalConverted = 0;
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Recursivamente procesar subdirectorios
      totalConverted += processDirectory(fullPath);
    } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
      // Procesar archivos JavaScript/React
      if (convertFileToEnglish(fullPath)) {
        totalConverted++;
      }
    }
  }
  
  return totalConverted;
}

// Ejecutar la conversión
const frontEndPath = path.join(__dirname, 'src');
console.log('Starting conversion of Spanish variables to English...');
console.log(`Processing directory: ${frontEndPath}`);

const convertedFiles = processDirectory(frontEndPath);

console.log(`\n🎉 Conversion completed!`);
console.log(`📁 Files converted: ${convertedFiles}`);
console.log('\n⚠️  Note: You may need to fix some import/export references manually.');
console.log('🔧 Run your linter and check for any remaining issues.');

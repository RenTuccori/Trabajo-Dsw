import { sequelize } from '../config/database.js';

// Importar todos los modelos
import Usuario from './Usuario.js';
import Doctor from './Doctor.js';
import Paciente from './Paciente.js';
import Admin from './Admin.js';
import ObraSocial from './ObraSocial.js';
import Sede from './Sede.js';
import Especialidad from './Especialidad.js';
import Turno from './Turno.js';
import Estudio from './Estudio.js';
import SedeDocEsp from './SedeDocEsp.js';
import HorarioDisponible from './HorarioDisponible.js';

// Definir asociaciones
const defineAssociations = () => {
  // Usuario -> Doctor (1:1)
  Usuario.hasOne(Doctor, { 
    foreignKey: 'dni', 
    sourceKey: 'dni',
    as: 'doctor'
  });
  Doctor.belongsTo(Usuario, { 
    foreignKey: 'dni', 
    targetKey: 'dni',
    as: 'usuario'
  });

  // Usuario -> Paciente (1:1)
  Usuario.hasOne(Paciente, { 
    foreignKey: 'dni', 
    sourceKey: 'dni',
    as: 'paciente'
  });
  Paciente.belongsTo(Usuario, { 
    foreignKey: 'dni', 
    targetKey: 'dni',
    as: 'usuario'
  });

  // Usuario -> ObraSocial (N:1)
  Usuario.belongsTo(ObraSocial, {
    foreignKey: 'idObraSocial',
    as: 'obraSocial'
  });
  ObraSocial.hasMany(Usuario, {
    foreignKey: 'idObraSocial',
    as: 'usuarios'
  });

  // Turno -> Doctor (N:1)
  Turno.belongsTo(Doctor, {
    foreignKey: 'idDoctor',
    as: 'doctor'
  });
  Doctor.hasMany(Turno, {
    foreignKey: 'idDoctor',
    as: 'turnos'
  });

  // Turno -> Paciente (N:1)
  Turno.belongsTo(Paciente, {
    foreignKey: 'idPaciente',
    as: 'paciente'
  });
  Paciente.hasMany(Turno, {
    foreignKey: 'idPaciente',
    as: 'turnos'
  });

  // Turno -> Especialidad (N:1)
  Turno.belongsTo(Especialidad, {
    foreignKey: 'idEspecialidad',
    as: 'especialidad'
  });
  Especialidad.hasMany(Turno, {
    foreignKey: 'idEspecialidad',
    as: 'turnos'
  });

  // Turno -> Sede (N:1)
  Turno.belongsTo(Sede, {
    foreignKey: 'idSede',
    as: 'sede'
  });
  Sede.hasMany(Turno, {
    foreignKey: 'idSede',
    as: 'turnos'
  });

  // Estudio -> Paciente (N:1)
  Estudio.belongsTo(Paciente, {
    foreignKey: 'idPaciente',
    as: 'paciente'
  });
  Paciente.hasMany(Estudio, {
    foreignKey: 'idPaciente',
    as: 'estudios'
  });

  // Estudio -> Doctor (N:1)
  Estudio.belongsTo(Doctor, {
    foreignKey: 'idDoctor',
    as: 'doctor'
  });
  Doctor.hasMany(Estudio, {
    foreignKey: 'idDoctor',
    as: 'estudios'
  });

  // SedeDocEsp -> Sede (N:1)
  SedeDocEsp.belongsTo(Sede, {
    foreignKey: 'idSede',
    as: 'sede'
  });
  
  // SedeDocEsp -> Doctor (N:1)
  SedeDocEsp.belongsTo(Doctor, {
    foreignKey: 'idDoctor',
    as: 'doctor'
  });
  
  // Doctor -> SedeDocEsp (1:N) - Asociación inversa
  Doctor.hasMany(SedeDocEsp, {
    foreignKey: 'idDoctor',
    as: 'sedeDocEsp'
  });
  
  // SedeDocEsp -> Especialidad (N:1)
  SedeDocEsp.belongsTo(Especialidad, {
    foreignKey: 'idEspecialidad',
    as: 'especialidad'
  });

  // Especialidad -> SedeDocEsp (1:N) - Asociación inversa
  Especialidad.hasMany(SedeDocEsp, {
    foreignKey: 'idEspecialidad',
    as: 'sedeDocEsp'
  });

  // Sede -> SedeDocEsp (1:N) - Asociación inversa
  Sede.hasMany(SedeDocEsp, {
    foreignKey: 'idSede',
    as: 'sedeDocEsp'
  });

  // HorarioDisponible -> Doctor (N:1)
  HorarioDisponible.belongsTo(Doctor, {
    foreignKey: 'idDoctor',
    as: 'doctor'
  });
  Doctor.hasMany(HorarioDisponible, {
    foreignKey: 'idDoctor',
    as: 'horarios'
  });

  // HorarioDisponible -> Sede (N:1)
  HorarioDisponible.belongsTo(Sede, {
    foreignKey: 'idSede',
    as: 'sede'
  });
  Sede.hasMany(HorarioDisponible, {
    foreignKey: 'idSede',
    as: 'horarios'
  });
};

// Inicializar asociaciones
defineAssociations();

export {
  sequelize,
  Usuario,
  Doctor,
  Paciente,
  Admin,
  ObraSocial,
  Sede,
  Especialidad,
  Turno,
  Estudio,
  SedeDocEsp,
  HorarioDisponible
};
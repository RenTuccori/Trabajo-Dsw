import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Import models
import { defineUsuario } from './Usuario.js';
import { defineDoctor } from './Doctor.js';
import { definePaciente } from './Paciente.js';
import { defineEspecialidad } from './Especialidad.js';
import { defineSede } from './Sede.js';
import { defineObraSocial } from './ObraSocial.js';
import { defineTurno } from './Turno.js';
import { defineAdmin } from './Admin.js';
import { defineEstudio } from './Estudio.js';
import { defineFecha } from './Fecha.js';
import { defineHorarioDisponible } from './HorarioDisponible.js';
import { defineSedeDoctorEsp } from './SedeDoctorEsp.js';

// Initialize models
const Usuario = defineUsuario(sequelize);
const Doctor = defineDoctor(sequelize);
const Paciente = definePaciente(sequelize);
const Especialidad = defineEspecialidad(sequelize);
const Sede = defineSede(sequelize);
const ObraSocial = defineObraSocial(sequelize);
const Turno = defineTurno(sequelize);
const Admin = defineAdmin(sequelize);
const Estudio = defineEstudio(sequelize);
const Fecha = defineFecha(sequelize);
const HorarioDisponible = defineHorarioDisponible(sequelize);
const SedeDoctorEsp = defineSedeDoctorEsp(sequelize);

// Define associations

// Usuario - ObraSocial
Usuario.belongsTo(ObraSocial, { foreignKey: 'idObraSocial', as: 'obraSocial' });
ObraSocial.hasMany(Usuario, { foreignKey: 'idObraSocial', as: 'usuarios' });

// Doctor - Usuario
Doctor.belongsTo(Usuario, { foreignKey: 'dni', targetKey: 'dni', as: 'usuario' });
Usuario.hasOne(Doctor, { foreignKey: 'dni', sourceKey: 'dni', as: 'doctor' });

// Paciente - Usuario
Paciente.belongsTo(Usuario, { foreignKey: 'dni', targetKey: 'dni', as: 'usuario' });
Usuario.hasOne(Paciente, { foreignKey: 'dni', sourceKey: 'dni', as: 'paciente' });

// Turno associations
Turno.belongsTo(Paciente, { foreignKey: 'idPaciente', as: 'paciente' });
Turno.belongsTo(Doctor, { foreignKey: 'idDoctor', as: 'doctor' });
Turno.belongsTo(Especialidad, { foreignKey: 'idEspecialidad', as: 'especialidad' });
Turno.belongsTo(Sede, { foreignKey: 'idSede', as: 'sede' });

Paciente.hasMany(Turno, { foreignKey: 'idPaciente', as: 'turnos' });
Doctor.hasMany(Turno, { foreignKey: 'idDoctor', as: 'turnos' });
Especialidad.hasMany(Turno, { foreignKey: 'idEspecialidad', as: 'turnos' });
Sede.hasMany(Turno, { foreignKey: 'idSede', as: 'turnos' });

// SedeDoctorEsp associations
SedeDoctorEsp.belongsTo(Sede, { foreignKey: 'idSede', as: 'sede' });
SedeDoctorEsp.belongsTo(Doctor, { foreignKey: 'idDoctor', as: 'doctor' });
SedeDoctorEsp.belongsTo(Especialidad, { foreignKey: 'idEspecialidad', as: 'especialidad' });

Sede.hasMany(SedeDoctorEsp, { foreignKey: 'idSede', as: 'combinaciones' });
Doctor.hasMany(SedeDoctorEsp, { foreignKey: 'idDoctor', as: 'combinaciones' });
Especialidad.hasMany(SedeDoctorEsp, { foreignKey: 'idEspecialidad', as: 'combinaciones' });

// HorarioDisponible associations
HorarioDisponible.belongsTo(Sede, { foreignKey: 'idSede', as: 'sede' });
HorarioDisponible.belongsTo(Doctor, { foreignKey: 'idDoctor', as: 'doctor' });
HorarioDisponible.belongsTo(Especialidad, { foreignKey: 'idEspecialidad', as: 'especialidad' });

// Estudio associations
Estudio.belongsTo(Paciente, { foreignKey: 'idPaciente', as: 'paciente' });
Estudio.belongsTo(Doctor, { foreignKey: 'idDoctor', as: 'doctor' });
Paciente.hasMany(Estudio, { foreignKey: 'idPaciente', as: 'estudios' });
Doctor.hasMany(Estudio, { foreignKey: 'idDoctor', as: 'estudios' });

export {
  sequelize,
  Usuario,
  Doctor,
  Paciente,
  Especialidad,
  Sede,
  ObraSocial,
  Turno,
  Admin,
  Estudio,
  Fecha,
  HorarioDisponible,
  SedeDoctorEsp,
};

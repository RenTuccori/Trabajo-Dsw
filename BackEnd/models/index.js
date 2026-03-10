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
import { defineUser } from './User.js';
import { defineDoctor } from './Doctor.js';
import { definePatient } from './Patient.js';
import { defineSpecialty } from './Specialty.js';
import { defineLocation } from './Location.js';
import { defineHealthInsurance } from './HealthInsurance.js';
import { defineAppointment } from './Appointment.js';
import { defineAdmin } from './Admin.js';
import { defineStudy } from './Study.js';
import { defineDate } from './Date.js';
import { defineAvailableSchedule } from './AvailableSchedule.js';
import { defineLocationDoctorSpecialty } from './LocationDoctorSpecialty.js';

// Initialize models
const User = defineUser(sequelize);
const Doctor = defineDoctor(sequelize);
const Patient = definePatient(sequelize);
const Specialty = defineSpecialty(sequelize);
const Location = defineLocation(sequelize);
const HealthInsurance = defineHealthInsurance(sequelize);
const Appointment = defineAppointment(sequelize);
const Admin = defineAdmin(sequelize);
const Study = defineStudy(sequelize);
const Date = defineDate(sequelize);
const AvailableSchedule = defineAvailableSchedule(sequelize);
const LocationDoctorSpecialty = defineLocationDoctorSpecialty(sequelize);

// Define associations

// User - HealthInsurance
User.belongsTo(HealthInsurance, { foreignKey: 'healthInsuranceId', as: 'healthInsurance' });
HealthInsurance.hasMany(User, { foreignKey: 'healthInsuranceId', as: 'users' });

// Doctor - User
Doctor.belongsTo(User, { foreignKey: 'nationalId', targetKey: 'nationalId', as: 'user' });
User.hasOne(Doctor, { foreignKey: 'nationalId', sourceKey: 'nationalId', as: 'doctor' });

// Patient - User
Patient.belongsTo(User, { foreignKey: 'nationalId', targetKey: 'nationalId', as: 'user' });
User.hasOne(Patient, { foreignKey: 'nationalId', sourceKey: 'nationalId', as: 'patient' });

// Appointment associations
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Appointment.belongsTo(Specialty, { foreignKey: 'specialtyId', as: 'specialty' });
Appointment.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });

Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });
Specialty.hasMany(Appointment, { foreignKey: 'specialtyId', as: 'appointments' });
Location.hasMany(Appointment, { foreignKey: 'locationId', as: 'appointments' });

// LocationDoctorSpecialty associations
LocationDoctorSpecialty.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
LocationDoctorSpecialty.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
LocationDoctorSpecialty.belongsTo(Specialty, { foreignKey: 'specialtyId', as: 'specialty' });

Location.hasMany(LocationDoctorSpecialty, { foreignKey: 'locationId', as: 'combinations' });
Doctor.hasMany(LocationDoctorSpecialty, { foreignKey: 'doctorId', as: 'combinations' });
Specialty.hasMany(LocationDoctorSpecialty, { foreignKey: 'specialtyId', as: 'combinations' });

// AvailableSchedule associations
AvailableSchedule.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
AvailableSchedule.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
AvailableSchedule.belongsTo(Specialty, { foreignKey: 'specialtyId', as: 'specialty' });

// Study associations
Study.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Study.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Patient.hasMany(Study, { foreignKey: 'patientId', as: 'studies' });
Doctor.hasMany(Study, { foreignKey: 'doctorId', as: 'studies' });

export {
  sequelize,
  User,
  Doctor,
  Patient,
  Specialty,
  Location,
  HealthInsurance,
  Appointment,
  Admin,
  Study,
  Date,
  AvailableSchedule,
  LocationDoctorSpecialty,
};

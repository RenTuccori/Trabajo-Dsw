import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Patient from './Patient.js';
import Specialty from './Specialty.js';
import Doctor from './Doctor.js';
import Location from './Location.js';

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
  },
  date_time: {
    type: DataTypes.DATE,
  },
  cancellation_date: {
    type: DataTypes.DATE,
  },
  confirmation_date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.STRING(20),
  },
  specialty_id: {
    type: DataTypes.INTEGER,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  location_id: {
    type: DataTypes.INTEGER,
  },
  email_sent: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'appointments',
  timestamps: false,
});

Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });
Appointment.belongsTo(Specialty, { foreignKey: 'specialty_id' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Appointment.belongsTo(Location, { foreignKey: 'location_id' });

export default Appointment;
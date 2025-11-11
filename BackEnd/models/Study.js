import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Patient from './Patient.js';
import Doctor from './Doctor.js';

const Study = sequelize.define('Study', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  performed_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  upload_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'studies',
  timestamps: false,
});

Study.belongsTo(Patient, { foreignKey: 'patient_id' });
Study.belongsTo(Doctor, { foreignKey: 'doctor_id' });

export default Study;
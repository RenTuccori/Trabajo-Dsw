import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './User.js';

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  national_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'patients',
  timestamps: false,
});

Patient.belongsTo(User, { foreignKey: 'national_id' });

export default Patient;
import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './User.js';

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  national_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appointment_duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'doctors',
  timestamps: false,
});

Doctor.belongsTo(User, { foreignKey: 'national_id' });

export default Doctor;
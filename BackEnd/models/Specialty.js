import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Specialty = sequelize.define('Specialty', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'specialties',
  timestamps: false,
});

export default Specialty;
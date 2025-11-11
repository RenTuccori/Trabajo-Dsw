import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const HealthInsurance = sequelize.define('HealthInsurance', {
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
  tableName: 'health_insurances',
  timestamps: false,
});

export default HealthInsurance;
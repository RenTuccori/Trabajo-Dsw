import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import HealthInsurance from './HealthInsurance.js';

const User = sequelize.define('User', {
  national_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  email: {
    type: DataTypes.STRING(100),
  },
  address: {
    type: DataTypes.STRING(100),
  },
  health_insurance_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

User.belongsTo(HealthInsurance, { foreignKey: 'health_insurance_id' });

export default User;
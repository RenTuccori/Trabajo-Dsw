import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Administrator = sequelize.define('Administrator', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'administrators',
  timestamps: false,
});

export default Administrator;
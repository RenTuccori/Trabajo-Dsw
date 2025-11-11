import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const AvailableDate = sequelize.define('AvailableDate', {
  date: {
    type: DataTypes.DATEONLY,
    primaryKey: true,
  },
}, {
  tableName: 'dates',
  timestamps: false,
});

export default AvailableDate;
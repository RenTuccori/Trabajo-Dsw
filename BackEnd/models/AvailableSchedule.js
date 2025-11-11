import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Location from './Location.js';
import Doctor from './Doctor.js';
import Specialty from './Specialty.js';

const AvailableSchedule = sequelize.define('AvailableSchedule', {
  location_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  specialty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  day: {
    type: DataTypes.STRING(20),
    primaryKey: true,
  },
  start_time: {
    type: DataTypes.TIME,
    primaryKey: true,
  },
  end_time: {
    type: DataTypes.TIME,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'available_schedules',
  timestamps: false,
});

AvailableSchedule.belongsTo(Location, { foreignKey: 'location_id' });
AvailableSchedule.belongsTo(Doctor, { foreignKey: 'doctor_id' });
AvailableSchedule.belongsTo(Specialty, { foreignKey: 'specialty_id' });

export default AvailableSchedule;
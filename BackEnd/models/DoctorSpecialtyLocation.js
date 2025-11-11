import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Location from './Location.js';
import Doctor from './Doctor.js';
import Specialty from './Specialty.js';

const DoctorSpecialtyLocation = sequelize.define('DoctorSpecialtyLocation', {
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
  status: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  tableName: 'doctor_specialty_locations',
  timestamps: false,
});

DoctorSpecialtyLocation.belongsTo(Location, { foreignKey: 'location_id' });
DoctorSpecialtyLocation.belongsTo(Doctor, { foreignKey: 'doctor_id' });
DoctorSpecialtyLocation.belongsTo(Specialty, { foreignKey: 'specialty_id' });

export default DoctorSpecialtyLocation;
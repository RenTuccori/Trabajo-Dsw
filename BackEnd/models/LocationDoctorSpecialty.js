import { DataTypes } from 'sequelize';

export const defineLocationDoctorSpecialty = (sequelize) => {
  return sequelize.define('LocationDoctorSpecialty', {
    locationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Enabled',
    },
  }, {
    tableName: 'doctorspecialtylocations',
    timestamps: false,
  });
};

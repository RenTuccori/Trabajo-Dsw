import { DataTypes } from 'sequelize';

export const defineAvailableSchedule = (sequelize) => {
  return sequelize.define('AvailableSchedule', {
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
    day: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      primaryKey: true,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Available',
    },
  }, {
    tableName: 'availableschedules',
    timestamps: false,
  });
};

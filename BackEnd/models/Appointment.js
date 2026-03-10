import { DataTypes } from 'sequelize';

export const defineAppointment = (sequelize) => {
  return sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancellationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    confirmationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    email: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'appointments',
    timestamps: false,
  });
};

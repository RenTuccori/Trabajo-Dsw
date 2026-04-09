import { DataTypes } from 'sequelize';

export const defineDoctor = (sequelize) => {
  return sequelize.define('Doctor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nationalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    appointmentDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Enabled',
    },
  }, {
    tableName: 'doctors',
    timestamps: false,
  });
};

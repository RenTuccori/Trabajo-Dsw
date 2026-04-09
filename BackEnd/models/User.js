import { DataTypes } from 'sequelize';

export const defineUser = (sequelize) => {
  return sequelize.define('User', {
    nationalId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    healthInsuranceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });
};

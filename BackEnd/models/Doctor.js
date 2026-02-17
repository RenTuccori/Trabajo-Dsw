import { DataTypes } from 'sequelize';

export const defineDoctor = (sequelize) => {
  return sequelize.define('Doctor', {
    idDoctor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duracionTurno: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contra: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Habilitado',
    },
  }, {
    tableName: 'doctores',
    timestamps: false,
  });
};

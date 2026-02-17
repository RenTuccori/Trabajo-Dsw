import { DataTypes } from 'sequelize';

export const defineSedeDoctorEsp = (sequelize) => {
  return sequelize.define('SedeDoctorEsp', {
    idSede: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    idDoctor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    idEspecialidad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Habilitado',
    },
  }, {
    tableName: 'sededoctoresp',
    timestamps: false,
  });
};

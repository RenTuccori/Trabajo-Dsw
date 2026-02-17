import { DataTypes } from 'sequelize';

export const definePaciente = (sequelize) => {
  return sequelize.define('Paciente', {
    idPaciente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Habilitado',
    },
  }, {
    tableName: 'pacientes',
    timestamps: false,
  });
};

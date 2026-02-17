import { DataTypes } from 'sequelize';

export const defineHorarioDisponible = (sequelize) => {
  return sequelize.define('HorarioDisponible', {
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
    dia: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      primaryKey: true,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.TIME,
      primaryKey: true,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Habilitado',
    },
  }, {
    tableName: 'horarios_disponibles',
    timestamps: false,
  });
};

import { DataTypes } from 'sequelize';

export const defineTurno = (sequelize) => {
  return sequelize.define('Turno', {
    idTurno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idPaciente: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fechaYHora: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fechaCancelacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fechaConfirmacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    idEspecialidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idDoctor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idSede: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mail: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'turnos',
    timestamps: false,
  });
};

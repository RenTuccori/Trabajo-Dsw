import { DataTypes } from 'sequelize';

export const defineEstudio = (sequelize) => {
  return sequelize.define('Estudio', {
    idEstudio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idPaciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idDoctor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaRealizacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fechaCarga: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nombreArchivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rutaArchivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'estudios',
    timestamps: false,
  });
};

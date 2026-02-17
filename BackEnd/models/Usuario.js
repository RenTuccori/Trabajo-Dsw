import { DataTypes } from 'sequelize';

export const defineUsuario = (sequelize) => {
  return sequelize.define('Usuario', {
    dni: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    idObraSocial: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'usuarios',
    timestamps: false,
  });
};

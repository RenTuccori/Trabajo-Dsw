import { DataTypes } from 'sequelize';

export const defineSede = (sequelize) => {
  return sequelize.define('Sede', {
    idSede: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Habilitado',
    },
  }, {
    tableName: 'sedes',
    timestamps: false,
  });
};

import { DataTypes } from 'sequelize';

export const defineObraSocial = (sequelize) => {
  return sequelize.define('ObraSocial', {
    idObraSocial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Habilitado',
    },
  }, {
    tableName: 'obrasociales',
    timestamps: false,
  });
};

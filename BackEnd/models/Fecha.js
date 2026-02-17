import { DataTypes } from 'sequelize';

export const defineFecha = (sequelize) => {
  return sequelize.define('Fecha', {
    fechas: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
    },
  }, {
    tableName: 'fechas',
    timestamps: false,
  });
};

import { DataTypes } from 'sequelize';

export const defineDate = (sequelize) => {
  return sequelize.define('Date', {
    date: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
    },
  }, {
    tableName: 'dates',
    timestamps: false,
  });
};

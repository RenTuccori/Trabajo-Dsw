import { DataTypes } from 'sequelize';

export const defineHealthInsurance = (sequelize) => {
  return sequelize.define('HealthInsurance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Habilitado',
    },
  }, {
    tableName: 'healthinsurances',
    timestamps: false,
  });
};

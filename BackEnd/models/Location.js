import { DataTypes } from 'sequelize';

export const defineLocation = (sequelize) => {
  return sequelize.define('Location', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Enabled',
    },
  }, {
    tableName: 'locations',
    timestamps: false,
  });
};

import { DataTypes } from 'sequelize';

export const defineAdmin = (sequelize) => {
  return sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  }, {
    tableName: 'administrators',
    timestamps: false,
  });
};

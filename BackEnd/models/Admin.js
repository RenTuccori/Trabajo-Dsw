import { DataTypes } from 'sequelize';

export const defineAdmin = (sequelize) => {
  return sequelize.define('Admin', {
    idAdmin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    contra: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  }, {
    tableName: 'admin',
    timestamps: false,
  });
};

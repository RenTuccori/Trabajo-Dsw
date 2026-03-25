import { DataTypes } from 'sequelize';

export const defineSpecialty = (sequelize) => {
  return sequelize.define('Specialty', {
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
      defaultValue: 'Enabled',
    },
  }, {
    tableName: 'specialties',
    timestamps: false,
  });
};

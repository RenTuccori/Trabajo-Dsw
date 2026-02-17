import { DataTypes } from 'sequelize';

export const defineEspecialidad = (sequelize) => {
  return sequelize.define('Especialidad', {
    idEspecialidad: {
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
    tableName: 'especialidades',
    timestamps: false,
  });
};

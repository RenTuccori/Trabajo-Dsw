import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Especialidad = sequelize.define('Especialidad', {
  idEspecialidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  estado: {
    type: DataTypes.STRING(45),
    allowNull: false,
    defaultValue: 'Habilitado',
    validate: {
      isIn: [['Habilitado', 'Deshabilitado']]
    }
  }
}, {
  tableName: 'especialidades',
  timestamps: false
});

export default Especialidad;
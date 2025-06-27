import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ObraSocial = sequelize.define('ObraSocial', {
  idObraSocial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
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
  tableName: 'obrasociales',
  timestamps: false
});

export default ObraSocial;
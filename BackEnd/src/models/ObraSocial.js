// models/ObraSocial.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ObraSocial = sequelize.define('ObraSocial', {
  idObraSocial: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre de la obra social no puede estar vacío' },
      len: {
        args: [3, 100],
        msg: 'El nombre debe tener entre 3 y 100 caracteres'
      }
    }
  },
  estado: {
    type: DataTypes.STRING(45),
    allowNull: false,
    validate: {
      isIn: {
        args: [['activo', 'inactivo']],
        msg: 'El estado debe ser "activo" o "inactivo"'
      }
    }
  }
}, {
  tableName: 'obrasociales',
  timestamps: false // Esta tabla no tiene columnas createdAt/updatedAt
});

module.exports = ObraSocial;

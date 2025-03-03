// models/Especialidad.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajustá el path si hace falta

const Especialidad = sequelize.define('Especialidad', {
  idEspecialidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre de la especialidad es obligatorio' },
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
        args: [['activa', 'inactiva']],
        msg: 'El estado debe ser "activa" o "inactiva"'
      }
    }
  }
}, {
  tableName: 'especialidades',
  timestamps: false
});

module.exports = Especialidad;

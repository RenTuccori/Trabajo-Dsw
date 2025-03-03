// models/Doctor.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajustá el path si es necesario
const Usuario = require('./Usuario'); // Porque hay una FK que apunta a 'usuarios'

const Doctor = sequelize.define('Doctor', {
  idDoctor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dni: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,  // Hace referencia al modelo Usuario (la tabla `usuarios`)
      key: 'dni'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  duracionTurno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'La duración debe ser un número entero' },
      min: { args: [5], msg: 'La duración mínima es de 5 minutos' }
    }
  },
  contra: {
    type: DataTypes.STRING(45),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña es obligatoria' }
    }
  },
  estado: {
    type: DataTypes.STRING(45),
    allowNull: false,
    validate: {
      isIn: {
        args: [['activo', 'inactivo', 'suspendido']],
        msg: 'Estado inválido'
      }
    }
  }
}, {
  tableName: 'doctores',
  timestamps: false
});

// Definimos la relación
Doctor.belongsTo(Usuario, { foreignKey: 'dni', targetKey: 'dni' });

module.exports = Doctor;

// models/Paciente.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importamos el modelo de 'Usuario' porque hay una relación
const Usuario = require('./Usuario');

const Paciente = sequelize.define('Paciente', {
  idPaciente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  dni: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,  // Aseguramos que el DNI no se repita
    validate: {
      isInt: { msg: 'El DNI debe ser un número entero' },
      len: {
        args: [7, 8], // DNI de Argentina generalmente tiene 7 u 8 dígitos
        msg: 'El DNI debe tener entre 7 y 8 dígitos'
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
  tableName: 'pacientes',
  timestamps: false  // No tiene columnas createdAt/updatedAt
});

// Relación: Un paciente pertenece a un usuario (FK en paciente -> dni)
Usuario.hasOne(Paciente, { foreignKey: 'dni' });
Paciente.belongsTo(Usuario, { foreignKey: 'dni' });

module.exports = Paciente;

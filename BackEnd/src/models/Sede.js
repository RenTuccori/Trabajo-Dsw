// models/Sede.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importamos los modelos relacionados (si hay relaciones en este modelo)
const SedeDoctorEspecialidad = require('./SedeDoctorEspecialidad');

const Sede = sequelize.define('Sede', {
  idSede: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre de la sede no puede estar vacío' }
    }
  },
  direccion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La dirección de la sede no puede estar vacía' }
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
  tableName: 'sedes',
  timestamps: false  // No tiene columnas createdAt/updatedAt
});

// Relación: Una sede tiene una relación muchos a muchos con Doctor y Especialidad
Sede.belongsToMany(Doctor, { through: SedeDoctorEspecialidad, foreignKey: 'idSede' });
Sede.belongsToMany(Especialidad, { through: SedeDoctorEspecialidad, foreignKey: 'idSede' });

module.exports = Sede;

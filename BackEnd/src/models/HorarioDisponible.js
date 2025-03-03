// models/HorarioDisponible.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importamos los otros modelos porque hay FK
const Sede = require('./Sede');
const Doctor = require('./Doctor');
const Especialidad = require('./Especialidad');

const HorarioDisponible = sequelize.define('HorarioDisponible', {
  dia: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
    validate: {
      isIn: {
        args: [['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']],
        msg: 'El día debe ser válido (lunes a domingo)'
      }
    }
  },
  hora_inicio: {
    type: DataTypes.TIME,
    primaryKey: true,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    primaryKey: true,
    allowNull: false
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
  tableName: 'horarios_disponibles',
  timestamps: false
});

// Definimos las relaciones (FKs)
Sede.hasMany(HorarioDisponible, { foreignKey: 'idSede' });
HorarioDisponible.belongsTo(Sede, { foreignKey: 'idSede' });

Doctor.hasMany(HorarioDisponible, { foreignKey: 'idDoctor' });
HorarioDisponible.belongsTo(Doctor, { foreignKey: 'idDoctor' });

Especialidad.hasMany(HorarioDisponible, { foreignKey: 'idEspecialidad' });
HorarioDisponible.belongsTo(Especialidad, { foreignKey: 'idEspecialidad' });

module.exports = HorarioDisponible;

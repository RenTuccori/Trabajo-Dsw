// models/Turno.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importamos los modelos relacionados
const Paciente = require('./Paciente');
const Doctor = require('./Doctor');
const Especialidad = require('./Especialidad');
const Sede = require('./Sede');

const Turno = sequelize.define('Turno', {
  idTurno: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idPaciente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pacientes',
      key: 'idPaciente'
    }
  },
  fechaYHora: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fechaCancelacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fechaConfirmacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: {
        args: [['pendiente', 'confirmado', 'cancelado']],
        msg: 'El estado debe ser "pendiente", "confirmado" o "cancelado"'
      }
    }
  },
  idEspecialidad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'especialidades',
      key: 'idEspecialidad'
    }
  },
  idDoctor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'doctores',
      key: 'idDoctor'
    }
  },
  idSede: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'sedes',
      key: 'idSede'
    }
  },
  mail: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'turnos',
  timestamps: false // No tiene createdAt/updatedAt
});

// Relaciones
Turno.belongsTo(Paciente, { foreignKey: 'idPaciente' });
Turno.belongsTo(Especialidad, { foreignKey: 'idEspecialidad' });
Turno.belongsTo(Doctor, { foreignKey: 'idDoctor' });
Turno.belongsTo(Sede, { foreignKey: 'idSede' });

module.exports = Turno;

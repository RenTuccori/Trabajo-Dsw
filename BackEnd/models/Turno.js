import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Turno = sequelize.define('Turno', {
  idTurno: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idDoctor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'doctores',
      key: 'idDoctor'
    }
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
      isIn: [['Disponible', 'Reservado', 'Confirmado', 'Cancelado', 'Completado']]
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
  idSede: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'sedes',
      key: 'idSede'
    }
  },
  mail: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'turnos',
  timestamps: false
});

export default Turno;
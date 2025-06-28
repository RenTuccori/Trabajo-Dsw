import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Estudio = sequelize.define('Estudio', {
  idEstudio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPaciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pacientes',
      key: 'idPaciente'
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
  fechaRealizacion: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaCarga: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  nombreArchivo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rutaArchivo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'estudios',
  timestamps: false
});

export default Estudio;
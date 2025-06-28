import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const HorarioDisponible = sequelize.define('HorarioDisponible', {
  idDoctor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'doctores',
      key: 'idDoctor'
    }
  },
  idSede: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'sedes',
      key: 'idSede'
    }
  },
  idEspecialidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'especialidades',
      key: 'idEspecialidad'
    }
  },
  dia: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
    validate: {
      isIn: [['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']]
    }
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
    primaryKey: true
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false,
    primaryKey: true
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
  tableName: 'horarios_disponibles',
  timestamps: false
});

export default HorarioDisponible;
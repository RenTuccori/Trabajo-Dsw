import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const SedeDocEsp = sequelize.define('SedeDocEsp', {
  idSede: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'sedes',
      key: 'idSede'
    }
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
  idEspecialidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'especialidades',
      key: 'idEspecialidad'
    }
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
  tableName: 'sededoctoresp',
  timestamps: false
});

export default SedeDocEsp;
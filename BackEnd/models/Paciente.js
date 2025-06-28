import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Paciente = sequelize.define('Paciente', {
  idPaciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dni: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'usuarios',
      key: 'dni'
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
  tableName: 'pacientes',
  timestamps: false
});

export default Paciente;
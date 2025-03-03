// models/Usuario.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ObraSocial = require('./ObraSocial');

const Usuario = sequelize.define('Usuario', {
  dni: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  fechaNacimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  idObraSocial: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'obrasociales',
      key: 'idObraSocial'
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: false // No tiene createdAt/updatedAt
});

// Relaciones
Usuario.belongsTo(ObraSocial, { foreignKey: 'idObraSocial' });

module.exports = Usuario;

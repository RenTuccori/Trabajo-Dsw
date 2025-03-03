const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turno = sequelize.define('Turno', {
  fecha: DataTypes.DATE,
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado'),
    defaultValue: 'pendiente',
  }
}, { tableName: 'turnos', timestamps: true });

module.exports = Turno;

// models/Admin.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajustá el path según donde tengas la conexión.

const Admin = sequelize.define('Admin', {
  idAdmin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: { msg: 'El usuario es obligatorio' },
      notEmpty: { msg: 'El usuario no puede estar vacío' }
    }
  },
  contra: {
    type: DataTypes.STRING(45),
    allowNull: false,
    validate: {
      notNull: { msg: 'La contraseña es obligatoria' },
      notEmpty: { msg: 'La contraseña no puede estar vacía' }
    }
  }
}, {
  tableName: 'admin',
  timestamps: false // Esta tabla no tiene createdAt ni updatedAt
});

module.exports = Admin;

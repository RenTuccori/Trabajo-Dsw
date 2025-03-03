// models/SedeDoctorEspecialidad.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importamos los modelos que participan en la relación
const Sede = require('./Sede');
const Doctor = require('./Doctor');
const Especialidad = require('./Especialidad');

const SedeDoctorEspecialidad = sequelize.define('SedeDoctorEspecialidad', {
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
  tableName: 'sededoctoresp',
  timestamps: false,  // No tiene columnas createdAt/updatedAt
});

// Relaciones muchos a muchos entre Sede, Doctor y Especialidad
Sede.belongsToMany(Doctor, { through: SedeDoctorEspecialidad, foreignKey: 'idSede' });
Doctor.belongsToMany(Sede, { through: SedeDoctorEspecialidad, foreignKey: 'idDoctor' });

Sede.belongsToMany(Especialidad, { through: SedeDoctorEspecialidad, foreignKey: 'idSede' });
Especialidad.belongsToMany(Sede, { through: SedeDoctorEspecialidad, foreignKey: 'idEspecialidad' });

Doctor.belongsToMany(Especialidad, { through: SedeDoctorEspecialidad, foreignKey: 'idDoctor' });
Especialidad.belongsToMany(Doctor, { through: SedeDoctorEspecialidad, foreignKey: 'idEspecialidad' });

module.exports = SedeDoctorEspecialidad;

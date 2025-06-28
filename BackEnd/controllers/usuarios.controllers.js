import { Usuario, ObraSocial, Doctor } from '../models/index.js';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        {
          model: ObraSocial,
          as: 'obraSocial',
        },
      ],
    });

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'No hay usuarios cargados' });
    }

    res.json(usuarios);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByDniFecha = async (req, res) => {
  try {
    const { dni, fechaNacimiento } = req.body;

    const usuario = await Usuario.findOne({
      where: {
        dni,
        fechaNacimiento,
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const token = jwt.sign(
      {
        dni: usuario.dni,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: 'P',
      },
      'CLAVE_SUPER_SEGURISIMA',
      { expiresIn: '5m' }
    );

    res.json(token);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByDni = async (req, res) => {
  try {
    const { dni } = req.body;

    console.log('🔍 Buscando usuario con DNI:', dni);

    const usuario = await Usuario.findOne({
      where: { dni },
      include: [
        {
          model: ObraSocial,
          as: 'obraSocial',
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario ya es doctor (incluyendo deshabilitados)
    const esDoctor = await Doctor.findOne({
      where: { dni }
    });

    const usuarioConInfo = {
      ...usuario.toJSON(),
      yaEsDoctor: !!esDoctor && esDoctor.estado === 'Habilitado',
      doctorDeshabilitado: !!esDoctor && esDoctor.estado === 'Deshabilitado',
      idDoctor: esDoctor?.idDoctor || null
    };

    console.log('✅ Usuario encontrado:', { 
      dni, 
      yaEsDoctor: !!esDoctor && esDoctor.estado === 'Habilitado',
      doctorDeshabilitado: !!esDoctor && esDoctor.estado === 'Deshabilitado'
    });
    res.json(usuarioConInfo);
  } catch (error) {
    console.error('❌ Error al buscar usuario:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      dni,
      fechaNacimiento,
      nombre,
      apellido,
      telefono,
      email,
      direccion,
      idObraSocial,
    } = req.body;

    const nuevoUsuario = await Usuario.create({
      dni,
      fechaNacimiento,
      nombre,
      apellido,
      telefono,
      email,
      direccion,
      idObraSocial,
    });

    res.json(nuevoUsuario);
  } catch (error) {
    // Sequelize maneja automáticamente validaciones
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map((e) => e.message),
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'El usuario ya existe',
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { dni, nombre, apellido, telefono, email, direccion, idObraSocial } =
      req.body;

    // First check if user exists
    const userExists = await Usuario.findOne({ where: { dni } });
    if (!userExists) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Attempt to update - even if 0 rows are updated (no changes), it's still a success
    await Usuario.update(
      { nombre, apellido, telefono, email, direccion, idObraSocial },
      { where: { dni } }
    );

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map((e) => e.message),
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { dni } = req.params;

    const deletedRowsCount = await Usuario.destroy({
      where: { dni },
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
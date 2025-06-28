import { Paciente, Usuario, ObraSocial, Turno, Doctor } from '../models/index.js';
import jwt from 'jsonwebtoken';

export const getPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      where: { estado: 'Habilitado' },
      include: [{
        model: Usuario,
        as: 'usuario',
        include: [{
          model: ObraSocial,
          as: 'obraSocial'
        }]
      }]
    });

    if (pacientes.length === 0) {
      return res.status(404).json({ message: 'No hay pacientes cargados' });
    }

    res.json(pacientes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getPacienteByDni = async (req, res) => {
  try {
    const { dni } = req.body;

    const paciente = await Paciente.findOne({
      where: { dni },
      include: [{
        model: Usuario,
        as: 'usuario',
        include: [{
          model: ObraSocial,
          as: 'obraSocial'
        }]
      }, {
        model: Turno,
        as: 'turnos',
        include: [{
          model: Doctor,
          as: 'doctor',
          include: [{
            model: Usuario,
            as: 'usuario'
          }]
        }]
      }]
    });

    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.json(paciente);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPacienteLogin = async (req, res) => {
  try {
    const { dni, fechaNacimiento } = req.body;

    const paciente = await Paciente.findOne({
      include: [{
        model: Usuario,
        as: 'usuario',
        where: { dni, fechaNacimiento }
      }]
    });

    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    const token = jwt.sign(
      {
        idPaciente: paciente.idPaciente,
        dni: paciente.usuario.dni,
        nombre: paciente.usuario.nombre,
        apellido: paciente.usuario.apellido,
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

export const createPaciente = async (req, res) => {
  try {
    const { dni } = req.body;

    // Verificar que el usuario existe
    const usuario = await Usuario.findOne({ where: { dni } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const nuevoPaciente = await Paciente.create({
      dni,
      estado: 'Habilitado'
    });

    // Retornar con la información del usuario incluida
    const pacienteCompleto = await Paciente.findByPk(nuevoPaciente.idPaciente, {
      include: [{
        model: Usuario,
        as: 'usuario',
        include: [{
          model: ObraSocial,
          as: 'obraSocial'
        }]
      }]
    });

    res.json(pacienteCompleto);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'El paciente ya existe'
      });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const [updatedRowsCount] = await Paciente.update(
      { estado },
      { where: { idPaciente: id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.json({ message: 'Paciente actualizado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete
    const [updatedRowsCount] = await Paciente.update(
      { estado: 'Deshabilitado' },
      { where: { idPaciente: id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.json({ message: 'Paciente deshabilitado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

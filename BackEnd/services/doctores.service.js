import { Doctor, Usuario, ObraSocial, SedeDoctorEsp, HorarioDisponible } from '../models/index.js';
import { sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { USER_TYPES } from '../constants/userTypes.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const getDoctorsBySedEsp = async (idSede, idEspecialidad) => {
  const doctors = await Doctor.findAll({
    where: { estado: 'Habilitado' },
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['nombre', 'apellido'],
      },
      {
        model: SedeDoctorEsp,
        as: 'combinaciones',
        where: { idSede, idEspecialidad, estado: 'Habilitado' },
        attributes: [],
      },
    ],
  });
  return doctors.map(d => ({
    idDoctor: d.idDoctor,
    nombreyapellido: `${d.usuario.nombre} ${d.usuario.apellido}`,
  }));
};

export const getAvailableDoctorsForSede = async (idSede) => {
  const assignedIds = await SedeDoctorEsp.findAll({
    where: { idSede, estado: 'Habilitado' },
    attributes: ['idDoctor'],
    raw: true,
  });
  const ids = assignedIds.map(r => r.idDoctor);

  const doctors = await Doctor.findAll({
    where: {
      estado: 'Habilitado',
      ...(ids.length > 0 && { idDoctor: { [Op.notIn]: ids } }),
    },
    include: [{
      model: Usuario,
      as: 'usuario',
      attributes: ['nombre', 'apellido'],
    }],
  });
  return doctors.map(d => ({
    idDoctor: d.idDoctor,
    nombreyapellido: `${d.usuario.nombre} ${d.usuario.apellido}`,
  }));
};

export const getAllEnabledDoctors = async () => {
  const doctors = await Doctor.findAll({
    where: { estado: 'Habilitado' },
    include: [{
      model: Usuario,
      as: 'usuario',
      attributes: ['nombre', 'apellido'],
    }],
    order: [[{ model: Usuario, as: 'usuario' }, 'apellido', 'ASC']],
  });
  return doctors.map(d => ({
    idDoctor: d.idDoctor,
    nombreyapellido: `${d.usuario.nombre} ${d.usuario.apellido}`,
  }));
};

export const findDoctorByDni = async (dni) => {
  const doctor = await Doctor.findOne({
    where: { dni, estado: 'Habilitado' },
    include: [{
      model: Usuario,
      as: 'usuario',
      attributes: ['dni', 'nombre', 'apellido', 'email'],
    }],
  });
  if (!doctor) return null;
  return {
    DNI: doctor.usuario.dni,
    nombre: doctor.usuario.nombre,
    apellido: doctor.usuario.apellido,
    email: doctor.usuario.email,
  };
};

export const findDoctorById = async (idDoctor) => {
  const doctor = await Doctor.findOne({
    where: { idDoctor, estado: 'Habilitado' },
    include: [{
      model: Usuario,
      as: 'usuario',
      include: [{
        model: ObraSocial,
        as: 'obraSocial',
        attributes: ['nombre'],
      }],
    }],
  });
  if (!doctor) return null;
  return {
    idDoctor: doctor.idDoctor,
    dni: doctor.usuario.dni,
    nombre: doctor.usuario.nombre,
    apellido: doctor.usuario.apellido,
    email: doctor.usuario.email,
    telefono: doctor.usuario.telefono,
    direccion: doctor.usuario.direccion,
    duracionTurno: doctor.duracionTurno,
    obraSocial: doctor.usuario.obraSocial?.nombre || null,
  };
};

export const authenticateDoctor = async (dni, contra) => {
  const doctor = await Doctor.findOne({
    where: { dni, contra, estado: 'Habilitado' },
    include: [{
      model: Usuario,
      as: 'usuario',
      attributes: ['nombre', 'apellido'],
    }],
  });
  if (!doctor) return null;

  const token = jwt.sign(
    { idDoctor: doctor.idDoctor, dni: doctor.dni, nombre: doctor.usuario.nombre, apellido: doctor.usuario.apellido, rol: USER_TYPES.DOCTOR },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  return { token };
};

export const createNewDoctor = async ({ dni, duracionTurno, contra }) => {
  const doctor = await Doctor.create({
    dni,
    duracionTurno,
    contra,
    estado: 'Habilitado',
  });
  return doctor;
};

export const softDeleteDoctor = async (idDoctor) => {
  const transaction = await sequelize.transaction();
  try {
    const [affectedRows] = await Doctor.update(
      { estado: 'Deshabilitado' },
      { where: { idDoctor }, transaction }
    );
    if (affectedRows === 0) {
      await transaction.rollback();
      return false;
    }
    await SedeDoctorEsp.update(
      { estado: 'Deshabilitado' },
      { where: { idDoctor }, transaction }
    );
    await HorarioDisponible.update(
      { estado: 'Deshabilitado' },
      { where: { idDoctor }, transaction }
    );
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateExistingDoctor = async (idDoctor, { duracionTurno, contra }) => {
  const [affectedRows] = await Doctor.update(
    { duracionTurno, contra },
    { where: { idDoctor } }
  );
  return affectedRows > 0;
};

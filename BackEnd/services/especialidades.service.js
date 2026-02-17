import { Especialidad, SedeDoctorEsp, HorarioDisponible } from '../models/index.js';
import { sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const getSpecialtiesBySede = async (idSede) => {
  const specialties = await Especialidad.findAll({
    where: { estado: 'Habilitado' },
    include: [{
      model: SedeDoctorEsp,
      as: 'combinaciones',
      where: { idSede, estado: 'Habilitado' },
      attributes: [],
    }],
    group: ['Especialidad.idEspecialidad'],
  });
  return specialties;
};

export const getAllEnabledSpecialties = async () => {
  const specialties = await Especialidad.findAll({
    where: { estado: 'Habilitado' },
  });
  return specialties;
};

export const getAvailableSpecialtiesForSede = async (idSede) => {
  const assignedIds = await SedeDoctorEsp.findAll({
    where: { idSede, estado: 'Habilitado' },
    attributes: ['idEspecialidad'],
    raw: true,
  });
  const ids = assignedIds.map(r => r.idEspecialidad);

  const specialties = await Especialidad.findAll({
    where: {
      estado: 'Habilitado',
      ...(ids.length > 0 && { idEspecialidad: { [Op.notIn]: ids } }),
    },
  });
  return specialties;
};

export const findSpecialtyById = async (idEspecialidad) => {
  const specialty = await Especialidad.findOne({
    where: { idEspecialidad, estado: 'Habilitado' },
  });
  return specialty;
};

export const createNewSpecialty = async ({ nombre }) => {
  const existing = await Especialidad.findOne({
    where: { nombre, estado: 'Habilitado' },
  });
  if (existing) {
    throw { status: 400, message: 'Ya existe una especialidad habilitada con ese nombre.' };
  }
  const specialty = await Especialidad.create({ nombre, estado: 'Habilitado' });
  return specialty;
};

export const softDeleteSpecialty = async (idEspecialidad) => {
  const transaction = await sequelize.transaction();
  try {
    const [affectedRows] = await Especialidad.update(
      { estado: 'Deshabilitado' },
      { where: { idEspecialidad }, transaction }
    );
    if (affectedRows === 0) {
      await transaction.rollback();
      return false;
    }
    await SedeDoctorEsp.update(
      { estado: 'Deshabilitado' },
      { where: { idEspecialidad }, transaction }
    );
    await HorarioDisponible.update(
      { estado: 'Deshabilitado' },
      { where: { idEspecialidad }, transaction }
    );
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

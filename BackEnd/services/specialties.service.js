import { Specialty, LocationDoctorSpecialty, AvailableSchedule } from '../models/index.js';
import { sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const getSpecialtiesByLocation = async (locationId) => {
  const specialties = await Specialty.findAll({
    where: { status: 'Habilitado' },
    include: [{
      model: LocationDoctorSpecialty,
      as: 'combinations',
      where: { locationId, status: 'Habilitado' },
      attributes: [],
    }],
    group: ['Specialty.id'],
  });
  return specialties;
};

export const getAllSpecialties = async () => {
  const specialties = await Specialty.findAll({
    where: { status: 'Habilitado' },
  });
  return specialties;
};

export const getAvailableSpecialties = async (locationId) => {
  const assignedIds = await LocationDoctorSpecialty.findAll({
    where: { locationId, status: 'Habilitado' },
    attributes: ['specialtyId'],
    raw: true,
  });
  const ids = assignedIds.map(r => r.specialtyId);

  const specialties = await Specialty.findAll({
    where: {
      status: 'Habilitado',
      ...(ids.length > 0 && { id: { [Op.notIn]: ids } }),
    },
  });
  return specialties;
};

export const findSpecialtyById = async (specialtyId) => {
  const specialty = await Specialty.findOne({
    where: { id: specialtyId, status: 'Habilitado' },
  });
  return specialty;
};

export const createNewSpecialty = async ({ name }) => {
  const existing = await Specialty.findOne({
    where: { name, status: 'Habilitado' },
  });
  if (existing) {
    throw { status: 400, message: 'An enabled specialty with that name already exists.' };
  }
  const specialty = await Specialty.create({ name, status: 'Habilitado' });
  return specialty;
};

export const softDeleteSpecialty = async (specialtyId) => {
  const transaction = await sequelize.transaction();
  try {
    const [affectedRows] = await Specialty.update(
      { status: 'Deshabilitado' },
      { where: { id: specialtyId }, transaction }
    );
    if (affectedRows === 0) {
      await transaction.rollback();
      return false;
    }
    await LocationDoctorSpecialty.update(
      { status: 'Deshabilitado' },
      { where: { specialtyId }, transaction }
    );
    await AvailableSchedule.update(
      { status: 'Deshabilitado' },
      { where: { specialtyId }, transaction }
    );
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

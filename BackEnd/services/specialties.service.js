import { Specialty, LocationDoctorSpecialty, AvailableSchedule } from '../models/index.js';
import { sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const getSpecialtiesByLocation = async (locationId) => {
  const specialties = await Specialty.findAll({
    where: { status: 'Enabled' },
    include: [{
      model: LocationDoctorSpecialty,
      as: 'combinations',
      where: { locationId, status: 'Enabled' },
      attributes: [],
    }],
    group: ['Specialty.id'],
  });
  return specialties;
};

export const getAllSpecialties = async () => {
  const specialties = await Specialty.findAll({
    where: { status: 'Enabled' },
  });
  return specialties;
};

export const getAvailableSpecialties = async (locationId) => {
  const assignedIds = await LocationDoctorSpecialty.findAll({
    where: { locationId, status: 'Enabled' },
    attributes: ['specialtyId'],
    raw: true,
  });
  const ids = assignedIds.map(r => r.specialtyId);

  const specialties = await Specialty.findAll({
    where: {
      status: 'Enabled',
      ...(ids.length > 0 && { id: { [Op.notIn]: ids } }),
    },
  });
  return specialties;
};

export const findSpecialtyById = async (specialtyId) => {
  const specialty = await Specialty.findOne({
    where: { id: specialtyId, status: 'Enabled' },
  });
  return specialty;
};

export const createNewSpecialty = async ({ name }) => {
  const existing = await Specialty.findOne({
    where: { name, status: 'Enabled' },
  });
  if (existing) {
    throw { status: 400, message: 'An enabled specialty with that name already exists.' };
  }
  const specialty = await Specialty.create({ name, status: 'Enabled' });
  return specialty;
};

export const updateExistingSpecialty = async (specialtyId, { name }) => {
  const existing = await Specialty.findOne({
    where: { name, status: 'Enabled', id: { [Op.ne]: specialtyId } },
  });
  if (existing) {
    throw { status: 400, message: 'An enabled specialty with that name already exists.' };
  }
  const [affectedRows] = await Specialty.update(
    { name },
    { where: { id: specialtyId, status: 'Enabled' } }
  );
  return affectedRows > 0;
};

export const softDeleteSpecialty = async (specialtyId) => {
  const transaction = await sequelize.transaction();
  try {
    const [affectedRows] = await Specialty.update(
      { status: 'Disabled' },
      { where: { id: specialtyId }, transaction }
    );
    if (affectedRows === 0) {
      await transaction.rollback();
      return false;
    }
    await LocationDoctorSpecialty.update(
      { status: 'Disabled' },
      { where: { specialtyId }, transaction }
    );
    await AvailableSchedule.update(
      { status: 'Unavailable' },
      { where: { specialtyId }, transaction }
    );
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

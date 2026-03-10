import { Location, LocationDoctorSpecialty } from '../models/index.js';
import { sequelize } from '../models/index.js';

export const getAllLocations = async () => {
  const locations = await Location.findAll({
    where: { status: 'Habilitado' },
  });
  return locations;
};

export const findLocationById = async (locationId) => {
  const location = await Location.findOne({
    where: { id: locationId, status: 'Habilitado' },
  });
  return location;
};

export const createNewLocation = async ({ name, address }) => {
  const existing = await Location.findOne({
    where: { name, status: 'Habilitado' },
  });
  if (existing) {
    throw { status: 400, message: 'An enabled location with that name already exists.' };
  }
  const location = await Location.create({ name, address, status: 'Habilitado' });
  return location;
};

export const updateExistingLocation = async (locationId, { name, address }) => {
  const [affectedRows] = await Location.update(
    { name, address },
    { where: { id: locationId } }
  );
  return affectedRows > 0;
};

export const softDeleteLocation = async (locationId) => {
  const transaction = await sequelize.transaction();
  try {
    const [affectedRows] = await Location.update(
      { status: 'Deshabilitado' },
      { where: { id: locationId }, transaction }
    );
    if (affectedRows === 0) {
      await transaction.rollback();
      return false;
    }
    await LocationDoctorSpecialty.update(
      { status: 'Deshabilitado' },
      { where: { locationId }, transaction }
    );
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

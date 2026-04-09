import { Location, LocationDoctorSpecialty } from '../models/index.js';
import { sequelize } from '../models/index.js';

export const getAllLocations = async () => {
  const locations = await Location.findAll({
    where: { status: 'Enabled' },
  });
  return locations;
};

export const findLocationById = async (locationId) => {
  const location = await Location.findOne({
    where: { id: locationId, status: 'Enabled' },
  });
  return location;
};

export const createNewLocation = async ({ name, address }) => {
  const existing = await Location.findOne({
    where: { name, status: 'Enabled' },
  });
  if (existing) {
    throw { status: 400, message: 'An enabled location with that name already exists.' };
  }
  const location = await Location.create({ name, address, status: 'Enabled' });
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
      { status: 'Disabled' },
      { where: { id: locationId }, transaction }
    );
    if (affectedRows === 0) {
      await transaction.rollback();
      return false;
    }
    await LocationDoctorSpecialty.update(
      { status: 'Disabled' },
      { where: { locationId }, transaction }
    );
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

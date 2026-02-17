import { Sede, SedeDoctorEsp } from '../models/index.js';
import { sequelize } from '../models/index.js';

export const getAllLocations = async () => {
  const locations = await Sede.findAll({
    where: { estado: 'Habilitado' },
  });
  return locations;
};

export const findLocationById = async (idSede) => {
  const location = await Sede.findOne({
    where: { idSede, estado: 'Habilitado' },
  });
  return location;
};

export const createNewLocation = async ({ nombre, direccion }) => {
  const existing = await Sede.findOne({
    where: { nombre, estado: 'Habilitado' },
  });
  if (existing) {
    throw { status: 400, message: 'An enabled location with that name already exists.' };
  }
  const location = await Sede.create({ nombre, direccion, estado: 'Habilitado' });
  return location;
};

export const updateExistingLocation = async (idSede, { nombre, direccion }) => {
  const [affectedRows] = await Sede.update(
    { nombre, direccion },
    { where: { idSede } }
  );
  return affectedRows > 0;
};

export const softDeleteLocation = async (idSede) => {
  const transaction = await sequelize.transaction();
  try {
    const [affectedRows] = await Sede.update(
      { estado: 'Deshabilitado' },
      { where: { idSede }, transaction }
    );
    if (affectedRows === 0) {
      await transaction.rollback();
      return false;
    }
    await SedeDoctorEsp.update(
      { estado: 'Deshabilitado' },
      { where: { idSede }, transaction }
    );
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

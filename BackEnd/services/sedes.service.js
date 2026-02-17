import { Sede, SedeDoctorEsp } from '../models/index.js';
import { sequelize } from '../models/index.js';

export const getAllSedes = async () => {
  const sedes = await Sede.findAll({
    where: { estado: 'Habilitado' },
  });
  return sedes;
};

export const findSedeById = async (idSede) => {
  const sede = await Sede.findOne({
    where: { idSede, estado: 'Habilitado' },
  });
  return sede;
};

export const createNewSede = async ({ nombre, direccion }) => {
  const existing = await Sede.findOne({
    where: { nombre, estado: 'Habilitado' },
  });
  if (existing) {
    throw { status: 400, message: 'Ya existe una sede habilitada con ese nombre.' };
  }
  const sede = await Sede.create({ nombre, direccion, estado: 'Habilitado' });
  return sede;
};

export const updateExistingSede = async (idSede, { nombre, direccion }) => {
  const [affectedRows] = await Sede.update(
    { nombre, direccion },
    { where: { idSede } }
  );
  return affectedRows > 0;
};

export const softDeleteSede = async (idSede) => {
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

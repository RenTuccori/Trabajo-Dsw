import { ObraSocial } from '../models/index.js';

export const getAllHealthInsurance = async () => {
  const insuranceList = await ObraSocial.findAll({
    where: { estado: 'Habilitado' },
  });
  return insuranceList;
};

export const findHealthInsuranceById = async (idObraSocial) => {
  const insurance = await ObraSocial.findOne({
    where: { idObraSocial, estado: 'Habilitado' },
  });
  return insurance;
};

export const createNewHealthInsurance = async ({ nombre }) => {
  const insurance = await ObraSocial.create({
    nombre,
    estado: 'Habilitado',
  });
  return insurance;
};

export const softDeleteHealthInsurance = async (idObraSocial) => {
  const [affectedRows] = await ObraSocial.update(
    { estado: 'Deshabilitado' },
    { where: { idObraSocial } }
  );
  return affectedRows > 0;
};

export const updateExistingHealthInsurance = async (idObraSocial, { nombre }) => {
  if (!nombre) {
    throw { status: 400, message: 'Name is required.' };
  }
  const [affectedRows] = await ObraSocial.update(
    { nombre },
    { where: { idObraSocial } }
  );
  return affectedRows > 0;
};

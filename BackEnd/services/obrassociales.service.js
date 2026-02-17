import { ObraSocial } from '../models/index.js';

export const getAllObrasSociales = async () => {
  const obrasSociales = await ObraSocial.findAll({
    where: { estado: 'Habilitado' },
  });
  return obrasSociales;
};

export const findObraSocialById = async (idObraSocial) => {
  const obraSocial = await ObraSocial.findOne({
    where: { idObraSocial, estado: 'Habilitado' },
  });
  return obraSocial;
};

export const createNewObraSocial = async ({ nombre }) => {
  const obraSocial = await ObraSocial.create({
    nombre,
    estado: 'Habilitado',
  });
  return obraSocial;
};

export const softDeleteObraSocial = async (idObraSocial) => {
  const [affectedRows] = await ObraSocial.update(
    { estado: 'Deshabilitado' },
    { where: { idObraSocial } }
  );
  return affectedRows > 0;
};

export const updateExistingObraSocial = async (idObraSocial, { nombre }) => {
  if (!nombre) {
    throw { status: 400, message: 'El nombre es requerido.' };
  }
  const [affectedRows] = await ObraSocial.update(
    { nombre },
    { where: { idObraSocial } }
  );
  return affectedRows > 0;
};

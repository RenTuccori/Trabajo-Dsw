import { Usuario, ObraSocial } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { USER_TYPES } from '../constants/userTypes.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const getAllUsers = async () => {
  const users = await Usuario.findAll();
  return users;
};

export const findUserByDni = async (dni) => {
  const user = await Usuario.findByPk(dni);
  return user;
};

export const authenticatePatient = async (dni, fechaNacimiento) => {
  const user = await Usuario.findOne({
    where: { dni, fechaNacimiento },
    include: [{
      model: ObraSocial,
      as: 'obraSocial',
      attributes: ['nombre'],
    }],
  });
  if (!user) return null;

  const token = jwt.sign(
    { dni: user.dni, nombre: user.nombre, apellido: user.apellido, role: USER_TYPES.PATIENT },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  return { token };
};

export const createNewUser = async (userData) => {
  const user = await Usuario.create(userData);
  return user;
};

export const updateExistingUser = async (dni, userData) => {
  const [affectedRows] = await Usuario.update(userData, {
    where: { dni },
  });
  return affectedRows > 0;
};

export const deleteExistingUser = async (dni) => {
  const affectedRows = await Usuario.destroy({ where: { dni } });
  return affectedRows > 0;
};

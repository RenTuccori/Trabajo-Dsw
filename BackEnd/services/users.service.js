import { User, HealthInsurance } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { USER_TYPES } from '../constants/userTypes.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};

export const findUserByNationalId = async (nationalId) => {
  const user = await User.findByPk(nationalId);
  return user;
};

export const authenticatePatient = async (nationalId, birthDate) => {
  const user = await User.findOne({
    where: { nationalId, birthDate },
    include: [{
      model: HealthInsurance,
      as: 'healthInsurance',
      attributes: ['name'],
    }],
  });
  if (!user) return null;

  const token = jwt.sign(
    { nationalId: user.nationalId, firstName: user.firstName, lastName: user.lastName, role: USER_TYPES.PATIENT },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  return { token };
};

export const createNewUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

export const updateExistingUser = async (nationalId, userData) => {
  const [affectedRows] = await User.update(userData, {
    where: { nationalId },
  });
  return affectedRows > 0;
};

export const deleteExistingUser = async (nationalId) => {
  const affectedRows = await User.destroy({ where: { nationalId } });
  return affectedRows > 0;
};

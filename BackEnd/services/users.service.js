import { User, HealthInsurance } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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

export const authenticatePatient = async (nationalId, password) => {
  const user = await User.findOne({
    where: { nationalId },
    include: [{
      model: HealthInsurance,
      as: 'healthInsurance',
      attributes: ['name'],
    }],
  });
  if (!user) {
    console.log(`User with nationalId ${nationalId} not found in DB`);
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log(`Password invalid for nationalId ${nationalId}. DB hash: ${user.password}, Input password: ${password}`);
    return null;
  }

  const token = jwt.sign(
    { nationalId: user.nationalId, firstName: user.firstName, lastName: user.lastName, role: USER_TYPES.PATIENT },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  return { token };
};

export const createNewUser = async (userData) => {
  const data = { ...userData };
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  const user = await User.create(data);
  return user;
};

export const updateExistingUser = async (nationalId, userData) => {
  const data = { ...userData };
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  const [affectedRows] = await User.update(data, {
    where: { nationalId },
  });
  return affectedRows > 0;
};

export const deleteExistingUser = async (nationalId) => {
  const affectedRows = await User.destroy({ where: { nationalId } });
  return affectedRows > 0;
};

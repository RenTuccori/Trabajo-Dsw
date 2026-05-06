import { User, HealthInsurance, Patient, sequelize } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { USER_TYPES } from '../constants/userTypes.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const getAllUsers = async () => {
  const users = await User.findAll({ where: { status: 'Enabled' } });
  return users;
};

export const findUserByNationalId = async (nationalId) => {
  const user = await User.findOne({ where: { nationalId, status: 'Enabled' } });
  return user;
};

export const authenticatePatient = async (nationalId, password) => {
  const user = await User.findOne({
    where: { nationalId, status: 'Enabled' },
    include: [{
      model: HealthInsurance,
      as: 'healthInsurance',
      attributes: ['name'],
    }],
  });
  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
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
  
  // Convertir fecha de DD/MM/YYYY a YYYY-MM-DD si es necesario
  if (data.birthDate && data.birthDate.includes('/')) {
    const [day, month, year] = data.birthDate.split('/');
    data.birthDate = `${year}-${month}-${day}`;
  }
  
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  // Verificar si el usuario ya existe
  const existingUser = await User.findByPk(userData.nationalId);
  if (existingUser) {
    if (existingUser.status === 'Enabled') {
      const error = new Error(`El usuario con DNI ${userData.nationalId} ya está registrado.`);
      error.code = 'DNI_ALREADY_EXISTS';
      error.statusCode = 409;
      throw error;
    } else {
      // Si está deshabilitado, reactivamos y sobreescribimos los datos
      data.status = 'Enabled';
      await existingUser.update(data);
      return existingUser;
    }
  }

  const user = await User.create(data);
  return user;
};

export const updateExistingUser = async (nationalId, userData) => {
  const user = await User.findOne({ where: { nationalId, status: 'Enabled' } });
  if (!user) return false;

  const data = { ...userData };
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  await User.update(data, {
    where: { nationalId },
  });
  return true;
};

export const deleteExistingUser = async (nationalId) => {
  const [affectedRows] = await User.update(
    { status: 'Disabled' },
    { where: { nationalId } }
  );
  return affectedRows > 0;
};

import { Doctor, User, HealthInsurance, LocationDoctorSpecialty, AvailableSchedule } from '../models/index.js';
import { sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { USER_TYPES } from '../constants/userTypes.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const getDoctorsByLocationSpecialty = async (locationId, specialtyId) => {
  const doctors = await Doctor.findAll({
    where: { status: 'Enabled' },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName'],
      },
      {
        model: LocationDoctorSpecialty,
        as: 'combinations',
        where: { locationId, specialtyId, status: 'Enabled' },
        attributes: [],
      },
    ],
  });
  return doctors.map(d => ({
    doctorId: d.id,
    fullName: `${d.user.firstName} ${d.user.lastName}`,
  }));
};

export const getAllAvailableDoctors = async (locationId) => {
  const assignedIds = await LocationDoctorSpecialty.findAll({
    where: { locationId, status: 'Enabled' },
    attributes: ['doctorId'],
    raw: true,
  });
  const ids = assignedIds.map(r => r.doctorId);

  const doctors = await Doctor.findAll({
    where: {
      status: 'Enabled',
      ...(ids.length > 0 && { id: { [Op.notIn]: ids } }),
    },
    include: [{
      model: User,
      as: 'user',
      attributes: ['firstName', 'lastName'],
    }],
  });
  return doctors.map(d => ({
    doctorId: d.id,
    fullName: `${d.user.firstName} ${d.user.lastName}`,
  }));
};

export const getAllDoctors = async () => {
  const doctors = await Doctor.findAll({
    where: { status: 'Enabled' },
    include: [{
      model: User,
      as: 'user',
      attributes: ['firstName', 'lastName'],
    }],
    order: [[{ model: User, as: 'user' }, 'lastName', 'ASC']],
  });
  return doctors.map(d => ({
    doctorId: d.id,
    fullName: `${d.user.firstName} ${d.user.lastName}`,
  }));
};

export const findDoctorByNationalId = async (nationalId) => {
  const doctor = await Doctor.findOne({
    where: { nationalId, status: 'Enabled' },
    include: [{
      model: User,
      as: 'user',
      attributes: ['nationalId', 'firstName', 'lastName', 'email'],
    }],
  });
  if (!doctor) return null;
  return {
    nationalId: doctor.user.nationalId,
    firstName: doctor.user.firstName,
    lastName: doctor.user.lastName,
    email: doctor.user.email,
  };
};

export const findDoctorById = async (doctorId) => {
  const doctor = await Doctor.findOne({
    where: { id: doctorId, status: 'Enabled' },
    include: [{
      model: User,
      as: 'user',
      include: [{
        model: HealthInsurance,
        as: 'healthInsurance',
        attributes: ['id', 'name'],
      }],
    }],
  });
  if (!doctor) return null;
  return {
    doctorId: doctor.id,
    nationalId: doctor.user.nationalId,
    firstName: doctor.user.firstName,
    lastName: doctor.user.lastName,
    email: doctor.user.email,
    phone: doctor.user.phone,
    address: doctor.user.address,
    appointmentDuration: doctor.appointmentDuration,
    healthInsuranceId: doctor.user.healthInsuranceId,
    healthInsurance: doctor.user.healthInsurance?.name || null,
  };
};

export const authenticateDoctor = async (nationalId, password) => {
  const doctor = await Doctor.findOne({
    where: { nationalId, status: 'Enabled' },
    include: [{
      model: User,
      as: 'user',
      where: { password },
      attributes: ['firstName', 'lastName'],
    }],
  });
  if (!doctor) return null;

  const token = jwt.sign(
    { doctorId: doctor.id, nationalId: doctor.nationalId, firstName: doctor.user.firstName, lastName: doctor.user.lastName, role: USER_TYPES.DOCTOR },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  return { token };
};

export const createNewDoctor = async ({ nationalId, appointmentDuration }) => {
  const doctor = await Doctor.create({
    nationalId,
    appointmentDuration,
    status: 'Enabled',
  });
  return doctor;
};

export const softDeleteDoctor = async (doctorId) => {
  const transaction = await sequelize.transaction();
  try {
    const [affectedRows] = await Doctor.update(
      { status: 'Disabled' },
      { where: { id: doctorId }, transaction }
    );
    if (affectedRows === 0) {
      await transaction.rollback();
      return false;
    }
    await LocationDoctorSpecialty.update(
      { status: 'Disabled' },
      { where: { doctorId }, transaction }
    );
    await AvailableSchedule.update(
      { status: 'Unavailable' },
      { where: { doctorId }, transaction }
    );
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateExistingDoctor = async (doctorId, { appointmentDuration }) => {
  const updates = { appointmentDuration };

  const [affectedRows] = await Doctor.update(
    updates,
    { where: { id: doctorId } }
  );
  return affectedRows > 0;
};

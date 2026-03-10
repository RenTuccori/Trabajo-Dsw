import { Admin, LocationDoctorSpecialty, Location, Doctor, Specialty, User, AvailableSchedule } from '../models/index.js';
import { Op, fn, col, where as seqWhere } from 'sequelize';
import jwt from 'jsonwebtoken';
import { USER_TYPES } from '../constants/userTypes.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateAdmin = async (username, password) => {
  const admin = await Admin.findOne({ where: { username, password } });
  if (!admin) return null;

  const token = jwt.sign(
    { id: admin.id, role: USER_TYPES.ADMIN },
    JWT_SECRET,
    { expiresIn: '30m' }
  );
  return { token };
};

export const createNewCombination = async ({ locationId, specialtyId, doctorId }) => {
  const existing = await LocationDoctorSpecialty.findOne({
    where: { locationId, specialtyId, doctorId },
  });

  if (existing) {
    if (existing.status === 'Habilitado') {
      throw { status: 400, message: 'The combination is already enabled.' };
    }
    await existing.update({ status: 'Habilitado' });
    return existing;
  }

  const combo = await LocationDoctorSpecialty.create({
    locationId,
    specialtyId,
    doctorId,
    status: 'Habilitado',
  });
  return combo;
};

export const softDeleteCombination = async ({ locationId, doctorId, specialtyId }) => {
  const [affectedRows] = await LocationDoctorSpecialty.update(
    { status: 'Deshabilitado' },
    { where: { locationId, doctorId, specialtyId } }
  );
  return affectedRows > 0;
};

export const getAllCombinations = async () => {
  const combinations = await LocationDoctorSpecialty.findAll({
    where: { status: 'Habilitado' },
    include: [
      { model: Location, as: 'location', attributes: ['name', 'address'], where: { status: 'Habilitado' } },
      { model: Specialty, as: 'specialty', attributes: ['name'], where: { status: 'Habilitado' } },
      {
        model: Doctor, as: 'doctor',
        where: { status: 'Habilitado' },
        include: [{ model: User, as: 'user', attributes: ['name', 'lastName'] }],
      },
    ],
  });
  return combinations.map(c => ({
    locationId: c.locationId,
    doctorId: c.doctorId,
    specialtyId: c.specialtyId,
    locationName: c.location?.name,
    specialtyName: c.specialty?.name,
    doctorName: c.doctor?.user?.name,
    doctorLastName: c.doctor?.user?.lastName,
  }));
};

export const createNewSchedule = async (scheduleData) => {
  const schedule = await AvailableSchedule.create({
    ...scheduleData,
    day: scheduleData.day?.toLowerCase(),
  });
  return schedule;
};

export const updateExistingSchedule = async ({ locationId, doctorId, specialtyId, day, startTime, endTime, status }) => {
  const [affectedRows] = await AvailableSchedule.update(
    { startTime, endTime, status },
    { where: { locationId, doctorId, specialtyId, [Op.and]: [seqWhere(fn('LOWER', col('day')), day.toLowerCase())] } }
  );
  return affectedRows > 0;
};

export const getSchedulesByDoctor = async ({ locationId, specialtyId, doctorId }) => {
  const schedules = await AvailableSchedule.findAll({
    where: { locationId, specialtyId, doctorId, status: 'Habilitado' },
    include: [
      { model: Location, as: 'location', attributes: ['name'] },
      { model: Specialty, as: 'specialty', attributes: ['name'] },
      {
        model: Doctor, as: 'doctor',
        include: [{ model: User, as: 'user', attributes: ['name', 'lastName'] }],
      },
    ],
  });
  return schedules.map(h => ({
    day: h.day.toLowerCase(),
    startTime: h.startTime ? h.startTime.substring(0, 5) : '',
    endTime: h.endTime ? h.endTime.substring(0, 5) : '',
    locationName: h.location?.name,
    specialtyName: h.specialty?.name,
    doctorName: h.doctor?.user?.name,
    doctorLastName: h.doctor?.user?.lastName,
  }));
};

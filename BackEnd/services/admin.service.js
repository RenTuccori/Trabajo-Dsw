import { Admin, LocationDoctorSpecialty, Location, Doctor, Specialty, User, AvailableSchedule } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { USER_TYPES } from '../constants/userTypes.js';

const JWT_SECRET = process.env.JWT_SECRET;

const CANONICAL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const normalizeDay = (day) => {
  const normalized = (day || '').toString().trim().toLowerCase();
  const canonical = CANONICAL_DAYS.find((d) => d.toLowerCase() === normalized);

  if (!canonical) {
    throw { status: 400, message: 'Invalid day. Use English weekday names (Monday to Sunday).' };
  }

  return canonical;
};

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
    if (existing.status === 'Enabled') {
      throw { status: 400, message: 'The combination is already enabled.' };
    }
    await existing.update({ status: 'Enabled' });
    return existing;
  }

  const combo = await LocationDoctorSpecialty.create({
    locationId,
    specialtyId,
    doctorId,
    status: 'Enabled',
  });
  return combo;
};

export const softDeleteCombination = async ({ locationId, doctorId, specialtyId }) => {
  const [affectedRows] = await LocationDoctorSpecialty.update(
    { status: 'Disabled' },
    { where: { locationId, doctorId, specialtyId } }
  );
  return affectedRows > 0;
};

export const getAllCombinations = async () => {
  const combinations = await LocationDoctorSpecialty.findAll({
    where: { status: 'Enabled' },
    include: [
      { model: Location, as: 'location', attributes: ['name', 'address'], where: { status: 'Enabled' } },
      { model: Specialty, as: 'specialty', attributes: ['name'], where: { status: 'Enabled' } },
      {
        model: Doctor, as: 'doctor',
        where: { status: 'Enabled' },
        include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
      },
    ],
  });
  return combinations.map(c => ({
    locationId: c.locationId,
    doctorId: c.doctorId,
    specialtyId: c.specialtyId,
    locationName: c.location?.name,
    specialtyName: c.specialty?.name,
    doctorName: c.doctor?.user?.firstName,
    doctorLastName: c.doctor?.user?.lastName,
  }));
};

export const createNewSchedule = async (scheduleData) => {
  const normalizedDay = normalizeDay(scheduleData.day);
  const schedule = await AvailableSchedule.create({
    ...scheduleData,
    day: normalizedDay,
    status: scheduleData.status || 'Available',
  });
  return schedule;
};

export const updateExistingSchedule = async ({ locationId, doctorId, specialtyId, day, startTime, endTime, status }) => {
  const normalizedDay = normalizeDay(day);
  const existing = await AvailableSchedule.findOne({
    where: {
      locationId,
      doctorId,
      specialtyId,
      day: normalizedDay,
    },
    order: [['startTime', 'ASC']],
  });

  if (!existing) return false;

  const [affectedRows] = await AvailableSchedule.update(
    { startTime, endTime, status: status || 'Available' },
    {
      where: {
        locationId,
        doctorId,
        specialtyId,
        day: existing.day,
        startTime: existing.startTime,
        endTime: existing.endTime,
      },
    }
  );

  return affectedRows > 0;
};

export const getSchedulesByDoctor = async ({ locationId, specialtyId, doctorId }) => {
  const schedules = await AvailableSchedule.findAll({
    where: {
      locationId,
      specialtyId,
      doctorId,
      status: 'Available',
    },
    include: [
      { model: Location, as: 'location', attributes: ['name'] },
      { model: Specialty, as: 'specialty', attributes: ['name'] },
      {
        model: Doctor, as: 'doctor',
        include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
      },
    ],
  });
  return schedules.map(h => ({
    day: normalizeDay(h.day),
    startTime: h.startTime ? h.startTime.substring(0, 5) : '',
    endTime: h.endTime ? h.endTime.substring(0, 5) : '',
    status: h.status,
    locationName: h.location?.name,
    specialtyName: h.specialty?.name,
    doctorName: h.doctor?.user?.firstName,
    doctorLastName: h.doctor?.user?.lastName,
  }));
};

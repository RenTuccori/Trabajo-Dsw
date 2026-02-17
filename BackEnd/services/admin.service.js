import { Admin, SedeDoctorEsp, Sede, Doctor, Especialidad, Usuario, HorarioDisponible } from '../models/index.js';
import { Op, fn, col, where as seqWhere } from 'sequelize';
import jwt from 'jsonwebtoken';
import { USER_TYPES } from '../constants/userTypes.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateAdmin = async (usuario, contra) => {
  const admin = await Admin.findOne({ where: { usuario, contra } });
  if (!admin) return null;

  const token = jwt.sign(
    { idAdmin: admin.idAdmin, role: USER_TYPES.ADMIN },
    JWT_SECRET,
    { expiresIn: '30m' }
  );
  return { token };
};

export const createNewCombination = async ({ idSede, idEspecialidad, idDoctor }) => {
  const existing = await SedeDoctorEsp.findOne({
    where: { idSede, idEspecialidad, idDoctor },
  });

  if (existing) {
    if (existing.estado === 'Habilitado') {
      throw { status: 400, message: 'The combination is already enabled.' };
    }
    await existing.update({ estado: 'Habilitado' });
    return existing;
  }

  const combo = await SedeDoctorEsp.create({
    idSede,
    idEspecialidad,
    idDoctor,
    estado: 'Habilitado',
  });
  return combo;
};

export const softDeleteCombination = async ({ idSede, idDoctor, idEspecialidad }) => {
  const [affectedRows] = await SedeDoctorEsp.update(
    { estado: 'Deshabilitado' },
    { where: { idSede, idDoctor, idEspecialidad } }
  );
  return affectedRows > 0;
};

export const getAllCombinations = async () => {
  const combinations = await SedeDoctorEsp.findAll({
    where: { estado: 'Habilitado' },
    include: [
      { model: Sede, as: 'sede', attributes: ['nombre', 'direccion'], where: { estado: 'Habilitado' } },
      { model: Especialidad, as: 'especialidad', attributes: ['nombre'], where: { estado: 'Habilitado' } },
      {
        model: Doctor, as: 'doctor',
        where: { estado: 'Habilitado' },
        include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido'] }],
      },
    ],
  });
  return combinations.map(c => ({
    idSede: c.idSede,
    idDoctor: c.idDoctor,
    idEspecialidad: c.idEspecialidad,
    locationName: c.sede?.nombre,
    specialtyName: c.especialidad?.nombre,
    doctorName: c.doctor?.usuario?.nombre,
    doctorLastName: c.doctor?.usuario?.apellido,
  }));
};

export const createNewSchedule = async (scheduleData) => {
  const schedule = await HorarioDisponible.create({
    ...scheduleData,
    dia: scheduleData.dia?.toLowerCase(),
  });
  return schedule;
};

export const updateExistingSchedule = async ({ idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado }) => {
  const [affectedRows] = await HorarioDisponible.update(
    { hora_inicio, hora_fin, estado },
    { where: { idSede, idDoctor, idEspecialidad, [Op.and]: [seqWhere(fn('LOWER', col('dia')), dia.toLowerCase())] } }
  );
  return affectedRows > 0;
};

export const getSchedulesByDoctor = async ({ idSede, idEspecialidad, idDoctor }) => {
  const schedules = await HorarioDisponible.findAll({
    where: { idSede, idEspecialidad, idDoctor, estado: 'Habilitado' },
    include: [
      { model: Sede, as: 'sede', attributes: ['nombre'] },
      { model: Especialidad, as: 'especialidad', attributes: ['nombre'] },
      {
        model: Doctor, as: 'doctor',
        include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido'] }],
      },
    ],
  });
  return schedules.map(h => ({
    dia: h.dia.toLowerCase(),
    hora_inicio: h.hora_inicio ? h.hora_inicio.substring(0, 5) : '',
    hora_fin: h.hora_fin ? h.hora_fin.substring(0, 5) : '',
    locationName: h.sede?.nombre,
    specialtyName: h.especialidad?.nombre,
    doctorName: h.doctor?.usuario?.nombre,
    doctorLastName: h.doctor?.usuario?.apellido,
  }));
};

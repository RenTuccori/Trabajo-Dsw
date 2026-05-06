import { Patient, Doctor, User, HealthInsurance } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllPatients = async () => {
  // Obtenemos los DNIs de los doctores activos
  const doctors = await Doctor.findAll({
    where: { status: 'Enabled' },
    attributes: ['nationalId'],
    raw: true,
  });
  const doctorIds = doctors.map(d => d.nationalId);

  // Buscamos los usuarios que NO sean doctores (activos)
  const users = await User.findAll({
    where: {
      status: 'Enabled',
      ...(doctorIds.length > 0 && { nationalId: { [Op.notIn]: doctorIds } })
    },
    include: [{
      model: HealthInsurance,
      as: 'healthInsurance',
      attributes: ['name'],
    }],
    order: [['lastName', 'ASC']],
  });

  return users.map(u => ({
    patientId: u.nationalId, // usaremos nationalId como key en frontend
    nationalId: u.nationalId,
    name: u.firstName,
    lastName: u.lastName,
    healthInsurance: u.healthInsurance?.name || null,
  }));
};

export const findPatientByNationalId = async (nationalId) => {
  const patient = await Patient.findOne({
    where: { status: 'Enabled' },
    include: [{
      model: User,
      as: 'user',
      where: { nationalId },
    }],
  });
  return patient;
};

export const createNewPatient = async ({ nationalId }) => {
  const existing = await Patient.findOne({
    where: { nationalId },
  });
  
  if (existing) {
    if (existing.status === 'Enabled') {
      throw { status: 400, message: 'Ya existe un paciente con ese DNI.' };
    } else {
      await existing.update({ status: 'Enabled' });
      return existing;
    }
  }
  
  const patient = await Patient.create({
    nationalId,
    status: 'Enabled',
  });
  return patient;
};

export const softDeletePatient = async (nationalId) => {
  const [affectedRows] = await Patient.update(
    { status: 'Disabled' },
    { where: { nationalId } }
  );
  return affectedRows > 0;
};

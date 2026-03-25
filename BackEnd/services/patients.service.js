import { Patient, User, HealthInsurance } from '../models/index.js';

export const getAllPatients = async () => {
  const patients = await Patient.findAll({
    where: { status: 'Enabled' },
    include: [{
      model: User,
      as: 'user',
      include: [{
        model: HealthInsurance,
        as: 'healthInsurance',
        attributes: ['name'],
      }],
    }],
      order: [[{ model: User, as: 'user' }, 'lastName', 'ASC']],
  });
  return patients.map(p => ({
    patientId: p.id,
      nationalId: p.user?.nationalId,
      name: p.user?.firstName,
      lastName: p.user?.lastName,
    healthInsurance: p.user?.healthInsurance?.name,
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
  const patient = await Patient.create({
    nationalId,
    status: 'Enabled',
  });
  return patient;
};

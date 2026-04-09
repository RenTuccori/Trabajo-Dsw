import { HealthInsurance } from '../models/index.js';

export const getAllHealthInsurance = async () => {
  const insuranceList = await HealthInsurance.findAll({
    where: { status: 'Enabled' },
  });
  return insuranceList;
};

export const findHealthInsuranceById = async (healthInsuranceId) => {
  const insurance = await HealthInsurance.findOne({
    where: { id: healthInsuranceId, status: 'Enabled' },
  });
  return insurance;
};

export const createNewHealthInsurance = async ({ name }) => {
  const insurance = await HealthInsurance.create({
    name,
    status: 'Enabled',
  });
  return insurance;
};

export const softDeleteHealthInsurance = async (healthInsuranceId) => {
  const [affectedRows] = await HealthInsurance.update(
    { status: 'Disabled' },
    { where: { id: healthInsuranceId } }
  );
  return affectedRows > 0;
};

export const updateExistingHealthInsurance = async (healthInsuranceId, { name }) => {
  if (!name) {
    throw { status: 400, message: 'Name is required.' };
  }
  const [affectedRows] = await HealthInsurance.update(
    { name },
    { where: { id: healthInsuranceId } }
  );
  return affectedRows > 0;
};

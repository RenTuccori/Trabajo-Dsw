import * as healthInsuranceService from '../services/health-insurance.service.js';

export const getHealthInsuranceList = async (req, res) => {
  try {
    const insuranceList = await healthInsuranceService.getAllHealthInsurance();
    if (insuranceList.length === 0) {
      return res.status(404).json({ message: 'No health insurance found' });
    }
    res.json(insuranceList);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHealthInsuranceById = async (req, res) => {
  try {
    const insurance = await healthInsuranceService.findHealthInsuranceById(req.params.id);
    if (!insurance) {
      return res.status(404).json({ message: 'Health insurance not found' });
    }
    res.json(insurance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createHealthInsurance = async (req, res) => {
  try {
    const insurance = await healthInsuranceService.createNewHealthInsurance(req.body);
    res.status(201).json(insurance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteHealthInsurance = async (req, res) => {
  try {
    const deleted = await healthInsuranceService.softDeleteHealthInsurance(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Health insurance not found' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateHealthInsurance = async (req, res) => {
  try {
    const updated = await healthInsuranceService.updateExistingHealthInsurance(
      req.params.id,
      req.body
    );
    if (!updated) {
      return res.status(404).json({ message: 'Health insurance not found' });
    }
    res.json({ message: 'Health insurance updated' });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

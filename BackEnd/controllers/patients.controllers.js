import * as patientsService from '../services/patients.service.js';

export const getPatients = async (req, res) => {
  try {
    const patients = await patientsService.getAllPatients();
    res.json(patients);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPatientByNationalId = async (req, res) => {
  try {
    const { nationalId } = req.body;
    const patient = await patientsService.findPatientByNationalId(nationalId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const patient = await patientsService.createNewPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

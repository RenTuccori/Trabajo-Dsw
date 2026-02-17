import * as pacientesService from '../services/pacientes.service.js';

export const getPatients = async (req, res) => {
  try {
    const patients = await pacientesService.getAllPatients();
    res.json(patients);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPatientByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const patient = await pacientesService.findPatientByDni(dni);
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
    const patient = await pacientesService.createNewPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

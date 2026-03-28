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
      // Si no existe un registro en la tabla Patient pero el usuario puede iniciar sesión,
      // creamos un registro mínimo de paciente para permitir operaciones posteriores.
      const created = await patientsService.createNewPatient({ nationalId });
      return res.status(201).json(created);
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

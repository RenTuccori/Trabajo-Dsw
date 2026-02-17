import * as pacientesService from '../services/pacientes.service.js';

export const getPacientes = async (req, res) => {
  try {
    const pacientes = await pacientesService.getAllPacientes();
    res.json(pacientes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPacienteByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const paciente = await pacientesService.findPacienteByDni(dni);
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json(paciente);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPaciente = async (req, res) => {
  try {
    const paciente = await pacientesService.createNewPaciente(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

import * as especialidadesService from '../services/especialidades.service.js';

export const getSpecialties = async (req, res) => {
  try {
    const { idSede } = req.body;
    const specialties = await especialidadesService.getSpecialtiesByLocation(idSede);
    res.json(specialties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await especialidadesService.getAllSpecialties();
    res.json(specialties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableSpecialties = async (req, res) => {
  try {
    const { idSede } = req.body;
    const specialties = await especialidadesService.getAvailableSpecialties(idSede);
    res.json(specialties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSpecialtyById = async (req, res) => {
  try {
    const specialty = await especialidadesService.findSpecialtyById(req.params.idEspecialidad);
    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    res.json(specialty);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSpecialty = async (req, res) => {
  try {
    const specialty = await especialidadesService.createNewSpecialty(req.body);
    res.status(201).json(specialty);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSpecialty = async (req, res) => {
  try {
    const deleted = await especialidadesService.softDeleteSpecialty(req.params.idEspecialidad);
    if (!deleted) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

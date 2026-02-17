import * as sedesService from '../services/sedes.service.js';

export const getSedes = async (req, res) => {
  try {
    const sedes = await sedesService.getAllSedes();
    if (sedes.length === 0) {
      return res.status(404).json({ message: 'No hay sedes habilitadas' });
    }
    res.json(sedes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSedeById = async (req, res) => {
  try {
    const sede = await sedesService.findSedeById(req.params.idSede);
    if (!sede) {
      return res.status(404).json({ message: 'Sede no encontrada o no está habilitada' });
    }
    res.json(sede);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSede = async (req, res) => {
  try {
    const sede = await sedesService.createNewSede(req.body);
    res.status(201).json(sede);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const updateSede = async (req, res) => {
  try {
    const updated = await sedesService.updateExistingSede(req.params.idSede, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }
    res.json({ message: 'Sede actualizada' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSede = async (req, res) => {
  try {
    const deleted = await sedesService.softDeleteSede(req.params.idSede);
    if (!deleted) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

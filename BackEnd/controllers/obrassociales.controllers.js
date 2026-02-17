import * as obrasSocialesService from '../services/obrassociales.service.js';

export const getObrasSociales = async (req, res) => {
  try {
    const obrasSociales = await obrasSocialesService.getAllObrasSociales();
    if (obrasSociales.length === 0) {
      return res.status(404).json({ message: 'No hay obras sociales' });
    }
    res.json(obrasSociales);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getObraSocialById = async (req, res) => {
  try {
    const obraSocial = await obrasSocialesService.findObraSocialById(req.params.idObraSocial);
    if (!obraSocial) {
      return res.status(404).json({ message: 'Obra social no encontrada' });
    }
    res.json(obraSocial);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createObraSocial = async (req, res) => {
  try {
    const obraSocial = await obrasSocialesService.createNewObraSocial(req.body);
    res.status(201).json(obraSocial);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteObraSocial = async (req, res) => {
  try {
    const deleted = await obrasSocialesService.softDeleteObraSocial(req.params.idObraSocial);
    if (!deleted) {
      return res.status(404).json({ message: 'Obra social no encontrada' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateObraSocial = async (req, res) => {
  try {
    const updated = await obrasSocialesService.updateExistingObraSocial(
      req.params.idObraSocial,
      req.body
    );
    if (!updated) {
      return res.status(404).json({ message: 'Obra social no encontrada' });
    }
    res.json({ message: 'Obra social actualizada' });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

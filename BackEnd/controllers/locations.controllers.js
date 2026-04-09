import * as locationsService from '../services/locations.service.js';

export const getLocations = async (req, res) => {
  try {
    const locations = await locationsService.getAllLocations();
    // Devolver una lista vacía (200) si no hay ubicaciones habilitadas.
    // Esto evita respuestas 404 que el frontend trata como errores.
    if (locations.length === 0) {
      return res.json([]);
    }
    res.json(locations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const location = await locationsService.findLocationById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found or not enabled' });
    }
    res.json(location);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createLocation = async (req, res) => {
  try {
    const location = await locationsService.createNewLocation(req.body);
    res.status(201).json(location);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const updated = await locationsService.updateExistingLocation(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const deleted = await locationsService.softDeleteLocation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Location not found' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

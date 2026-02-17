import * as sedesService from '../services/sedes.service.js';

export const getLocations = async (req, res) => {
  try {
    const locations = await sedesService.getAllLocations();
    if (locations.length === 0) {
      return res.status(404).json({ message: 'No enabled locations found' });
    }
    res.json(locations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const location = await sedesService.findLocationById(req.params.idSede);
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
    const location = await sedesService.createNewLocation(req.body);
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
    const updated = await sedesService.updateExistingLocation(req.params.idSede, req.body);
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
    const deleted = await sedesService.softDeleteLocation(req.params.idSede);
    if (!deleted) {
      return res.status(404).json({ message: 'Location not found' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

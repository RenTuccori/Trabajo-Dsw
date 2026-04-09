import * as schedulesService from '../services/schedules.service.js';

export const getAvailableDatesByDocSpecLoc = async (req, res) => {
  try {
    const { doctorId, specialtyId, locationId } = req.body;
    const result = await schedulesService.getAvailableDatesByDocSpecLoc(doctorId, specialtyId, locationId);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableDatesBySpecLoc = async (req, res) => {
  try {
    const { specialtyId, locationId } = req.body;
    const result = await schedulesService.getAvailableDatesBySpecLoc(specialtyId, locationId);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableSchedulesByDocSpecLoc = async (req, res) => {
  try {
    const { doctorId, specialtyId, locationId, fecha } = req.body;
    const result = await schedulesService.getAvailableSchedulesByDocSpecLoc(doctorId, specialtyId, locationId, fecha);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableSchedulesBySpecLoc = async (req, res) => {
  try {
    const { specialtyId, locationId, fecha } = req.body;
    const result = await schedulesService.getAvailableSchedulesBySpecLoc(specialtyId, locationId, fecha);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
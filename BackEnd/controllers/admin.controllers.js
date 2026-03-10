import * as adminService from '../services/admin.service.js';

export const getAdminByCredentials = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await adminService.authenticateAdmin(username, password);
    if (!result) {
      return res.status(404).json({ message: 'Administrator not found' });
    }
    res.json(result.token);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCombination = async (req, res) => {
  try {
    const combination = await adminService.createNewCombination(req.body);
    res.status(201).json(combination);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCombination = async (req, res) => {
  try {
    const { locationId, doctorId, specialtyId } = req.body;
    const deleted = await adminService.softDeleteCombination(locationId, doctorId, specialtyId);
    if (!deleted) {
      return res.status(404).json({ message: 'Combination not found' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCombinations = async (req, res) => {
  try {
    const combinations = await adminService.getAllCombinations();
    if (combinations.length === 0) {
      return res.status(404).json({ message: 'No combinations found' });
    }
    res.json(combinations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const schedule = await adminService.createNewSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const updated = await adminService.updateExistingSchedule(req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ message: 'Schedule updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const { locationId, specialtyId, doctorId } = req.body;
    const schedules = await adminService.getSchedulesByDoctor({ locationId, specialtyId, doctorId });
    res.json(schedules);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

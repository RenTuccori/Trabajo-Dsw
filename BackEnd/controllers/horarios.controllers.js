import * as horariosService from '../services/horarios.service.js';

export const getAvailableDatesByDocSpecLoc = async (req, res) => {
  try {
    const { idDoctor, idEspecialidad, idSede } = req.body;
    const result = await horariosService.getAvailableDatesByDocSpecLoc(idDoctor, idEspecialidad, idSede);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableDatesBySpecLoc = async (req, res) => {
  try {
    const { idEspecialidad, idSede } = req.body;
    const result = await horariosService.getAvailableDatesBySpecLoc(idEspecialidad, idSede);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableSchedulesByDocSpecLoc = async (req, res) => {
  try {
    const { idDoctor, idEspecialidad, idSede, fecha } = req.body;
    const result = await horariosService.getAvailableSchedulesByDocSpecLoc(idDoctor, idEspecialidad, idSede, fecha);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableSchedulesBySpecLoc = async (req, res) => {
  try {
    const { idEspecialidad, idSede, fecha } = req.body;
    const result = await horariosService.getAvailableSchedulesBySpecLoc(idEspecialidad, idSede, fecha);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
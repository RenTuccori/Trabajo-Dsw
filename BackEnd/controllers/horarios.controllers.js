import * as horariosService from '../services/horarios.service.js';

export const getFechasDispDocEspSed = async (req, res) => {
  try {
    const { idDoctor, idEspecialidad, idSede } = req.body;
    const result = await horariosService.getFechasDispDocEspSed(idDoctor, idEspecialidad, idSede);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFechasDispEspSed = async (req, res) => {
  try {
    const { idEspecialidad, idSede } = req.body;
    const result = await horariosService.getFechasDispEspSed(idEspecialidad, idSede);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHorariosDispDocEspSed = async (req, res) => {
  try {
    const { idDoctor, idEspecialidad, idSede, fecha } = req.body;
    const result = await horariosService.getHorariosDispDocEspSed(idDoctor, idEspecialidad, idSede, fecha);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHorariosDispEspSed = async (req, res) => {
  try {
    const { idEspecialidad, idSede, fecha } = req.body;
    const result = await horariosService.getHorariosDispEspSed(idEspecialidad, idSede, fecha);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
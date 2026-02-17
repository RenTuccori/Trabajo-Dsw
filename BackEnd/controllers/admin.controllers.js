import * as adminService from '../services/admin.service.js';

export const getAdminByUserContra = async (req, res) => {
  try {
    const { usuario, contra } = req.body;
    const result = await adminService.authenticateAdmin(usuario, contra);
    if (!result) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    res.json(result.token);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCombinacion = async (req, res) => {
  try {
    const combinacion = await adminService.createSedeDoctorEsp(req.body);
    res.status(201).json(combinacion);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCombinacion = async (req, res) => {
  try {
    const { idSede, idDoctor, idEspecialidad } = req.body;
    const deleted = await adminService.deleteSedeDoctorEsp(idSede, idDoctor, idEspecialidad);
    if (!deleted) {
      return res.status(404).json({ message: 'Combinación no encontrada' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCombinaciones = async (req, res) => {
  try {
    const combinaciones = await adminService.getAllCombinaciones();
    if (combinaciones.length === 0) {
      return res.status(404).json({ message: 'No hay combinaciones' });
    }
    res.json(combinaciones);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createHorario = async (req, res) => {
  try {
    const horario = await adminService.createNewHorario(req.body);
    res.status(201).json(horario);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateHorario = async (req, res) => {
  try {
    const updated = await adminService.updateExistingHorario(req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }
    res.json({ message: 'Horario actualizado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHorarios = async (req, res) => {
  try {
    const { idSede, idEspecialidad, idDoctor } = req.body;
    const horarios = await adminService.getHorariosByDoctor({ idSede, idEspecialidad, idDoctor });
    res.json(horarios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

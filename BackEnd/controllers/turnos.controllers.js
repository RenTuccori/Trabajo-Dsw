import * as turnosService from '../services/turnos.service.js';

export const getTurnoByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const turnos = await turnosService.getTurnosByPacienteDni(dni);
    if (turnos.length === 0) {
      return res.status(404).json({ message: 'No hay próximos turnos para este paciente' });
    }
    res.json(turnos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnoByDoctorHistorico = async (req, res) => {
  try {
    const { idDoctor } = req.body;
    const turnos = await turnosService.getTurnosHistoricoDoctor(idDoctor);
    if (turnos.length === 0) {
      return res.status(200).json({ message: 'No hay turnos históricos', data: [] });
    }
    return res.json({ data: turnos });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnoByDoctorHoy = async (req, res) => {
  try {
    const { idDoctor } = req.body;
    const turnos = await turnosService.getTurnosDoctorHoy(idDoctor);
    if (turnos.length === 0) {
      return res.status(404).json({ message: 'No hay turnos' });
    }
    res.json(turnos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnoByDoctorFecha = async (req, res) => {
  try {
    const { idDoctor, fechaYHora } = req.body;
    const turnos = await turnosService.getTurnosDoctorByFecha(idDoctor, fechaYHora);
    if (turnos.length === 0) {
      return res.status(404).json({ message: 'No hay turnos' });
    }
    res.json(turnos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const confirmarTurno = async (req, res) => {
  try {
    const { idTurno } = req.body;
    const updated = await turnosService.confirmTurno(idTurno);
    if (!updated) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    res.json({ message: 'Estado del turno actualizado a "Confirmado"' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cancelarTurno = async (req, res) => {
  try {
    const { idTurno } = req.body;
    const updated = await turnosService.cancelTurno(idTurno);
    if (!updated) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    res.json({ message: 'Estado del turno actualizado a "Cancelado"' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTurno = async (req, res) => {
  try {
    const turno = await turnosService.createNewTurno(req.body);
    res.status(201).json(turno);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTurno = async (req, res) => {
  try {
    const deleted = await turnosService.deleteExistingTurno(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

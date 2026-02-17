import * as turnosService from '../services/turnos.service.js';

export const getAppointmentByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const appointments = await turnosService.getAppointmentsByPatientDni(dni);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No upcoming appointments for this patient' });
    }
    res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByDoctorHistory = async (req, res) => {
  try {
    const { idDoctor } = req.body;
    const appointments = await turnosService.getDoctorAppointmentHistory(idDoctor);
    if (appointments.length === 0) {
      return res.status(200).json({ message: 'No appointment history', data: [] });
    }
    return res.json({ data: appointments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByDoctorToday = async (req, res) => {
  try {
    const { idDoctor } = req.body;
    const appointments = await turnosService.getDoctorAppointmentsToday(idDoctor);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }
    res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByDoctorDate = async (req, res) => {
  try {
    const { idDoctor, fechaYHora } = req.body;
    const appointments = await turnosService.getDoctorAppointmentsByDate(idDoctor, fechaYHora);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }
    res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const confirmAppointment = async (req, res) => {
  try {
    const { idTurno } = req.body;
    const updated = await turnosService.confirmAppointment(idTurno);
    if (!updated) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment status updated to "Confirmed"' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { idTurno } = req.body;
    const updated = await turnosService.cancelAppointment(idTurno);
    if (!updated) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment status updated to "Cancelled"' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await turnosService.createNewAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deleted = await turnosService.deleteExistingAppointment(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

import * as appointmentsService from '../services/appointments.service.js';

export const getAppointmentByNationalId = async (req, res) => {
  try {
    const { nationalId } = req.body;
    const appointments = await appointmentsService.getAppointmentsByPatientNationalId(nationalId);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No hay turnos próximos para este paciente' });
    }
    res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByDoctorHistory = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const appointments = await appointmentsService.getDoctorAppointmentHistory(doctorId);
    if (appointments.length === 0) {
      return res.status(200).json({ message: 'No hay historial de turnos', data: [] });
    }
    return res.json({ data: appointments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByDoctorToday = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const appointments = await appointmentsService.getDoctorAppointmentsToday(doctorId);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron turnos' });
    }
    res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByDoctorDate = async (req, res) => {
  try {
    const { doctorId, dateTime } = req.body;
    const appointments = await appointmentsService.getDoctorAppointmentsByDate(doctorId, dateTime);
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron turnos' });
    }
    res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const confirmAppointment = async (req, res) => {
  try {
    const { id } = req.body;
    const updated = await appointmentsService.confirmAppointment(id);
    if (!updated) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    res.json({ message: 'Turno confirmado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.body;
    const updated = await appointmentsService.cancelAppointment(id);
    if (!updated) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    res.json({ message: 'Turno cancelado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentsService.createNewAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deleted = await appointmentsService.deleteExistingAppointment(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

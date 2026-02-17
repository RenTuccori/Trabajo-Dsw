import * as doctoresService from '../services/doctores.service.js';

export const getDoctors = async (req, res) => {
  try {
    const { idSede, idEspecialidad } = req.body;
    const doctors = await doctoresService.getDoctorsByLocationSpecialty(idSede, idEspecialidad);
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found for this specialty' });
    }
    res.json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableDoctors = async (req, res) => {
  try {
    const { idSede } = req.body;
    const doctors = await doctoresService.getAllAvailableDoctors(idSede);
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No available doctors' });
    }
    res.json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctoresService.getAllDoctors();
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found' });
    }
    res.json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const doctor = await doctoresService.findDoctorByDni(dni);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await doctoresService.findDoctorById(req.params.idDoctor);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorByCredentials = async (req, res) => {
  try {
    const { dni, contra } = req.body;
    const result = await doctoresService.authenticateDoctor(dni, contra);
    if (!result) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(result.token);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const doctor = await doctoresService.createNewDoctor(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const deleted = await doctoresService.softDeleteDoctor(req.params.idDoctor);
    if (!deleted) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const updated = await doctoresService.updateExistingDoctor(req.params.idDoctor, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

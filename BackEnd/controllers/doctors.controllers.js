import * as doctorsService from '../services/doctors.service.js';

export const getDoctors = async (req, res) => {
  try {
    const { locationId, specialtyId } = req.body;
    const doctors = await doctorsService.getDoctorsByLocationSpecialty(locationId, specialtyId);
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
    const { locationId } = req.body;
    const doctors = await doctorsService.getAllAvailableDoctors(locationId);
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
    const doctors = await doctorsService.getAllDoctors();
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found' });
    }
    res.json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorByNationalId = async (req, res) => {
  try {
    const { nationalId } = req.body;
    const doctor = await doctorsService.findDoctorByNationalId(nationalId);
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
    const doctor = await doctorsService.findDoctorById(req.params.id);
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
    const { nationalId, password } = req.body;
    const result = await doctorsService.authenticateDoctor(nationalId, password);
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
    const doctor = await doctorsService.createNewDoctor(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const deleted = await doctorsService.softDeleteDoctor(req.params.id);
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
    const updated = await doctorsService.updateExistingDoctor(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

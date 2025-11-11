import Patient from '../models/Patient.js';
import User from '../models/User.js';
import HealthInsurance from '../models/HealthInsurance.js';

export const getPacientes = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      where: { status: 'Habilitado' },
      include: [
        {
          model: User,
          include: [HealthInsurance]
        }
      ],
      order: [[User, 'last_name'], [User, 'first_name']]
    });
    res.json(patients);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getPacienteByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const patient = await Patient.findOne({
      where: { national_id: dni, status: 'Habilitado' },
      include: [User]
    });
    if (!patient) {
      return res
        .status(404)
        .json({ message: 'Paciente no encontrado o no está habilitado' });
    } else {
      res.json(patient);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPaciente = async (req, res) => {
  const { dni } = req.body;
  const status = 'Habilitado';
  try {
    const newPatient = await Patient.create({
      national_id: dni,
      status: status,
    });
    res.json(newPatient);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

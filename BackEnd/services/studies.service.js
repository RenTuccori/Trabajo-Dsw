import { Study, Doctor, Patient, User } from '../models/index.js';

export const createStudy = async ({ patientId, doctorId, performanceDate, uploadDate, fileName, filePath, description }) => {
  return Study.create({ patientId, doctorId, performanceDate, uploadDate, fileName, filePath, description });
};

export const getStudiesByPatient = async (patientId) => {
  const studies = await Study.findAll({
    where: { patientId },
    include: [{
      model: Doctor,
      as: 'doctor',
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
    }],
    order: [['uploadDate', 'DESC']],
  });

  return studies.map(s => ({
    idEstudio: s.id,
    fechaRealizacion: s.performanceDate,
    fechaCarga: s.uploadDate,
    nombreArchivo: s.fileName,
    descripcion: s.description,
    doctorName: s.doctor?.user ? `${s.doctor.user.firstName} ${s.doctor.user.lastName}` : null,
  }));
};

export const getStudiesByDoctor = async (doctorId) => {
  const studies = await Study.findAll({
    where: { doctorId },
    include: [{
      model: Patient,
      as: 'patient',
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'nationalId'] }],
    }],
    order: [['uploadDate', 'DESC']],
  });

  return studies.map(s => ({
    idEstudio: s.id,
    fechaRealizacion: s.performanceDate,
    fechaCarga: s.uploadDate,
    nombreArchivo: s.fileName,
    descripcion: s.description,
    nombrePaciente: s.patient?.user ? `${s.patient.user.firstName} ${s.patient.user.lastName}` : null,
    dniPaciente: s.patient?.user?.nationalId,
  }));
};

export const findStudyById = async (id) => {
  return Study.findByPk(id);
};

export const deleteStudyById = async (id) => {
  const affectedRows = await Study.destroy({ where: { id } });
  return affectedRows > 0;
};

import { Estudio, Doctor, Paciente, Usuario } from '../models/index.js';

export const createStudy = async ({ idPaciente, idDoctor, fechaRealizacion, fechaCarga, nombreArchivo, rutaArchivo, descripcion }) => {
  return Estudio.create({ idPaciente, idDoctor, fechaRealizacion, fechaCarga, nombreArchivo, rutaArchivo, descripcion });
};

export const getStudiesByPatient = async (idPaciente) => {
  const studies = await Estudio.findAll({
    where: { idPaciente },
    include: [{
      model: Doctor, as: 'doctor',
      include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido'] }],
    }],
    order: [['fechaCarga', 'DESC']],
  });

  return studies.map(e => ({
    idEstudio: e.idEstudio,
    fechaRealizacion: e.fechaRealizacion,
    fechaCarga: e.fechaCarga,
    nombreArchivo: e.nombreArchivo,
    descripcion: e.descripcion,
    doctorName: e.doctor?.usuario ? `${e.doctor.usuario.nombre} ${e.doctor.usuario.apellido}` : null,
  }));
};

export const getStudiesByDoctor = async (idDoctor) => {
  const studies = await Estudio.findAll({
    where: { idDoctor },
    include: [{
      model: Paciente, as: 'paciente',
      include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido', 'dni'] }],
    }],
    order: [['fechaCarga', 'DESC']],
  });

  return studies.map(e => ({
    idEstudio: e.idEstudio,
    fechaRealizacion: e.fechaRealizacion,
    fechaCarga: e.fechaCarga,
    nombreArchivo: e.nombreArchivo,
    descripcion: e.descripcion,
    patientName: e.paciente?.usuario ? `${e.paciente.usuario.nombre} ${e.paciente.usuario.apellido}` : null,
    patientDni: e.paciente?.usuario?.dni,
  }));
};

export const findStudyById = async (idEstudio) => {
  return Estudio.findByPk(idEstudio);
};

export const deleteStudyById = async (idEstudio) => {
  const affectedRows = await Estudio.destroy({ where: { idEstudio } });
  return affectedRows > 0;
};

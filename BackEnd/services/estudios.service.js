import { Estudio, Doctor, Paciente, Usuario } from '../models/index.js';

export const createEstudio = async ({ idPaciente, idDoctor, fechaRealizacion, fechaCarga, nombreArchivo, rutaArchivo, descripcion }) => {
  return Estudio.create({ idPaciente, idDoctor, fechaRealizacion, fechaCarga, nombreArchivo, rutaArchivo, descripcion });
};

export const getEstudiosByPaciente = async (idPaciente) => {
  const estudios = await Estudio.findAll({
    where: { idPaciente },
    include: [{
      model: Doctor, as: 'doctor',
      include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido'] }],
    }],
    order: [['fechaCarga', 'DESC']],
  });

  return estudios.map(e => ({
    idEstudio: e.idEstudio,
    fechaRealizacion: e.fechaRealizacion,
    fechaCarga: e.fechaCarga,
    nombreArchivo: e.nombreArchivo,
    descripcion: e.descripcion,
    nombreDoctor: e.doctor?.usuario ? `${e.doctor.usuario.nombre} ${e.doctor.usuario.apellido}` : null,
  }));
};

export const getEstudiosByDoctor = async (idDoctor) => {
  const estudios = await Estudio.findAll({
    where: { idDoctor },
    include: [{
      model: Paciente, as: 'paciente',
      include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'apellido', 'dni'] }],
    }],
    order: [['fechaCarga', 'DESC']],
  });

  return estudios.map(e => ({
    idEstudio: e.idEstudio,
    fechaRealizacion: e.fechaRealizacion,
    fechaCarga: e.fechaCarga,
    nombreArchivo: e.nombreArchivo,
    descripcion: e.descripcion,
    nombrePaciente: e.paciente?.usuario ? `${e.paciente.usuario.nombre} ${e.paciente.usuario.apellido}` : null,
    dniPaciente: e.paciente?.usuario?.dni,
  }));
};

export const findEstudioById = async (idEstudio) => {
  return Estudio.findByPk(idEstudio);
};

export const deleteEstudioById = async (idEstudio) => {
  const affectedRows = await Estudio.destroy({ where: { idEstudio } });
  return affectedRows > 0;
};

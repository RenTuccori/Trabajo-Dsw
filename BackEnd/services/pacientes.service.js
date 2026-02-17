import { Paciente, Usuario, ObraSocial } from '../models/index.js';

export const getAllPatients = async () => {
  const patients = await Paciente.findAll({
    where: { estado: 'Habilitado' },
    include: [{
      model: Usuario,
      as: 'usuario',
      include: [{
        model: ObraSocial,
        as: 'obraSocial',
        attributes: ['nombre'],
      }],
    }],
    order: [[{ model: Usuario, as: 'usuario' }, 'nombre', 'ASC']],
  });
  return patients.map(p => ({
    idPaciente: p.idPaciente,
    dni: p.usuario?.dni,
    nombre: p.usuario?.nombre,
    apellido: p.usuario?.apellido,
    healthInsurance: p.usuario?.obraSocial?.nombre,
  }));
};

export const findPatientByDni = async (dni) => {
  const patient = await Paciente.findOne({
    where: { estado: 'Habilitado' },
    include: [{
      model: Usuario,
      as: 'usuario',
      where: { dni },
    }],
  });
  return patient;
};

export const createNewPatient = async ({ dni }) => {
  const patient = await Paciente.create({
    dni,
    estado: 'Habilitado',
  });
  return patient;
};

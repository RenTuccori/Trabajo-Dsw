import { Paciente, Usuario, ObraSocial } from '../models/index.js';

export const getAllPacientes = async () => {
  const pacientes = await Paciente.findAll({
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
  return pacientes.map(p => ({
    idPaciente: p.idPaciente,
    dni: p.usuario?.dni,
    nombre: p.usuario?.nombre,
    apellido: p.usuario?.apellido,
    obraSocial: p.usuario?.obraSocial?.nombre,
  }));
};

export const findPacienteByDni = async (dni) => {
  const paciente = await Paciente.findOne({
    where: { estado: 'Habilitado' },
    include: [{
      model: Usuario,
      as: 'usuario',
      where: { dni },
    }],
  });
  return paciente;
};

export const createNewPaciente = async ({ dni }) => {
  const paciente = await Paciente.create({
    dni,
    estado: 'Habilitado',
  });
  return paciente;
};

import { Turno, Paciente, Usuario, Sede, Doctor, Especialidad } from '../models/index.js';
import { Op, literal } from 'sequelize';

export const getTurnosByPacienteDni = async (dni) => {
  const paciente = await Paciente.findOne({
    include: [{ model: Usuario, as: 'usuario', where: { dni } }],
  });
  if (!paciente) return [];

  const turnos = await Turno.findAll({
    where: {
      idPaciente: paciente.idPaciente,
      estado: { [Op.ne]: 'Cancelado' },
      fechaYHora: { [Op.gt]: new Date() },
    },
    include: [
      { model: Sede, as: 'sede', attributes: ['nombre', 'direccion'] },
      { model: Especialidad, as: 'especialidad', attributes: ['nombre'] },
      {
        model: Doctor, as: 'doctor',
        include: [{ model: Usuario, as: 'usuario', attributes: ['apellido'] }],
      },
    ],
    order: [['fechaYHora', 'ASC']],
  });

  return turnos.map(t => ({
    dni,
    fecha_hora: t.fechaYHora,
    Sede: t.sede?.nombre,
    Direccion: t.sede?.direccion,
    Especialidad: t.especialidad?.nombre,
    Doctor: t.doctor?.usuario?.apellido,
    estado: t.estado,
    idTurno: t.idTurno,
  }));
};

export const getTurnosHistoricoDoctor = async (idDoctor) => {
  const turnos = await Turno.findAll({
    where: {
      idDoctor,
      estado: { [Op.ne]: 'Cancelado' },
      fechaYHora: { [Op.gte]: literal('CURRENT_DATE()') },
    },
    include: [
      { model: Sede, as: 'sede', attributes: ['nombre'] },
      { model: Especialidad, as: 'especialidad', attributes: ['nombre'] },
      {
        model: Paciente, as: 'paciente',
        include: [{ model: Usuario, as: 'usuario', attributes: ['dni', 'nombre', 'apellido'] }],
      },
    ],
    order: [['fechaYHora', 'ASC']],
  });

  return turnos.map(t => ({
    sede: t.sede?.nombre,
    especialidad: t.especialidad?.nombre,
    fechaYHora: t.fechaYHora,
    estado: t.estado,
    dni: t.paciente?.usuario?.dni,
    nomyapel: `${t.paciente?.usuario?.apellido} ${t.paciente?.usuario?.nombre}`,
  }));
};

export const getTurnosDoctorHoy = async (idDoctor) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const turnos = await Turno.findAll({
    where: {
      idDoctor,
      estado: 'Confirmado',
      fechaYHora: { [Op.gte]: startOfDay, [Op.lt]: endOfDay },
    },
    include: [
      { model: Sede, as: 'sede', attributes: ['nombre'] },
      { model: Especialidad, as: 'especialidad', attributes: ['nombre'] },
      {
        model: Paciente, as: 'paciente',
        include: [{ model: Usuario, as: 'usuario', attributes: ['dni', 'nombre', 'apellido'] }],
      },
    ],
    order: [['fechaYHora', 'ASC']],
  });

  return turnos.map(t => ({
    sede: t.sede?.nombre,
    especialidad: t.especialidad?.nombre,
    fechaYHora: t.fechaYHora,
    estado: t.estado,
    dni: t.paciente?.usuario?.dni,
    nomyapel: `${t.paciente?.usuario?.apellido} ${t.paciente?.usuario?.nombre}`,
  }));
};

export const getTurnosDoctorByFecha = async (idDoctor, fechaYHora) => {
  const turnos = await Turno.findAll({
    where: {
      idDoctor,
      estado: { [Op.ne]: 'Cancelado' },
      [Op.and]: literal(`DATE(fechaYHora) = '${fechaYHora}'`),
    },
    include: [
      { model: Sede, as: 'sede', attributes: ['nombre'] },
      { model: Especialidad, as: 'especialidad', attributes: ['nombre'] },
      {
        model: Paciente, as: 'paciente',
        include: [{ model: Usuario, as: 'usuario', attributes: ['dni', 'nombre', 'apellido'] }],
      },
    ],
    order: [['fechaYHora', 'ASC']],
  });

  return turnos.map(t => ({
    sede: t.sede?.nombre,
    especialidad: t.especialidad?.nombre,
    fechaYHora: t.fechaYHora,
    estado: t.estado,
    dni: t.paciente?.usuario?.dni,
    nomyapel: `${t.paciente?.usuario?.apellido} ${t.paciente?.usuario?.nombre}`,
  }));
};

export const confirmTurno = async (idTurno) => {
  const [affectedRows] = await Turno.update(
    { estado: 'Confirmado', fechaConfirmacion: new Date() },
    { where: { idTurno } }
  );
  return affectedRows > 0;
};

export const cancelTurno = async (idTurno) => {
  const [affectedRows] = await Turno.update(
    { estado: 'Cancelado', fechaCancelacion: new Date() },
    { where: { idTurno } }
  );
  return affectedRows > 0;
};

export const createNewTurno = async (turnoData) => {
  const turno = await Turno.create({
    ...turnoData,
    mail: null,
  });
  return turno;
};

export const deleteExistingTurno = async (idTurno) => {
  const affectedRows = await Turno.destroy({ where: { idTurno } });
  return affectedRows > 0;
};

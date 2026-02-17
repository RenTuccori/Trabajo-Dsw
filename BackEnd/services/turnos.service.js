import { Turno, Paciente, Usuario, Sede, Doctor, Especialidad } from '../models/index.js';
import { Op, literal } from 'sequelize';

export const getAppointmentsByPatientDni = async (dni) => {
  const patient = await Paciente.findOne({
    include: [{ model: Usuario, as: 'usuario', where: { dni } }],
  });
  if (!patient) return [];

  const appointments = await Turno.findAll({
    where: {
      idPaciente: patient.idPaciente,
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

  return appointments.map(t => ({
    dni,
    fecha_hora: t.fechaYHora,
    location: t.sede?.nombre,
    address: t.sede?.direccion,
    specialty: t.especialidad?.nombre,
    doctor: t.doctor?.usuario?.apellido,
    estado: t.estado,
    idTurno: t.idTurno,
  }));
};

export const getDoctorAppointmentHistory = async (idDoctor) => {
  const appointments = await Turno.findAll({
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

  return appointments.map(t => ({
    sede: t.sede?.nombre,
    especialidad: t.especialidad?.nombre,
    fechaYHora: t.fechaYHora,
    estado: t.estado,
    dni: t.paciente?.usuario?.dni,
    fullName: `${t.paciente?.usuario?.apellido} ${t.paciente?.usuario?.nombre}`,
  }));
};

export const getDoctorAppointmentsToday = async (idDoctor) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const appointments = await Turno.findAll({
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

  return appointments.map(t => ({
    sede: t.sede?.nombre,
    especialidad: t.especialidad?.nombre,
    fechaYHora: t.fechaYHora,
    estado: t.estado,
    dni: t.paciente?.usuario?.dni,
    fullName: `${t.paciente?.usuario?.apellido} ${t.paciente?.usuario?.nombre}`,
  }));
};

export const getDoctorAppointmentsByDate = async (idDoctor, fechaYHora) => {
  const appointments = await Turno.findAll({
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

  return appointments.map(t => ({
    sede: t.sede?.nombre,
    especialidad: t.especialidad?.nombre,
    fechaYHora: t.fechaYHora,
    estado: t.estado,
    dni: t.paciente?.usuario?.dni,
    fullName: `${t.paciente?.usuario?.apellido} ${t.paciente?.usuario?.nombre}`,
  }));
};

export const confirmAppointment = async (idTurno) => {
  const [affectedRows] = await Turno.update(
    { estado: 'Confirmado', fechaConfirmacion: new Date() },
    { where: { idTurno } }
  );
  return affectedRows > 0;
};

export const cancelAppointment = async (idTurno) => {
  const [affectedRows] = await Turno.update(
    { estado: 'Cancelado', fechaCancelacion: new Date() },
    { where: { idTurno } }
  );
  return affectedRows > 0;
};

export const createNewAppointment = async (appointmentData) => {
  const appointment = await Turno.create({
    ...appointmentData,
    mail: null,
  });
  return appointment;
};

export const deleteExistingAppointment = async (idTurno) => {
  const affectedRows = await Turno.destroy({ where: { idTurno } });
  return affectedRows > 0;
};

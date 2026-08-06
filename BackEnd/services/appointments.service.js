import { Appointment, Patient, User, Location, Doctor, Specialty, sequelize } from '../models/index.js';
import { Op, literal } from 'sequelize';
import { normalizeClinicDateTimeToUtc } from '../utils/dateTime.js';

const createSlotUnavailableError = () => {
  const error = new Error('The selected appointment time is no longer available.');
  error.statusCode = 409;
  error.code = 'APPOINTMENT_SLOT_UNAVAILABLE';
  return error;
};

export const getAppointmentsByPatientNationalId = async (nationalId) => {
  const patient = await Patient.findOne({
    include: [{ model: User, as: 'user', where: { nationalId } }],
  });
  if (!patient) return [];

  const appointments = await Appointment.findAll({
    where: {
      patientId: patient.id,
      status: { [Op.ne]: 'Cancelled' },
      dateTime: { [Op.gt]: new Date() },
    },
    include: [
      { model: Location, as: 'location', attributes: ['name', 'address'] },
      { model: Specialty, as: 'specialty', attributes: ['name'] },
      {
        model: Doctor, as: 'doctor',
        include: [{ model: User, as: 'user', attributes: ['lastName'] }],
      },
    ],
    order: [['dateTime', 'ASC']],
  });

  return appointments.map(t => ({
    nationalId,
    dateTime: t.dateTime,
    location: t.location?.name,
    address: t.location?.address,
    specialty: t.specialty?.name,
    doctor: t.doctor?.user?.lastName,
    status: t.status,
    appointmentId: t.id,
  }));
};

export const getDoctorAppointmentHistory = async (doctorId) => {
  const appointments = await Appointment.findAll({
    where: {
      doctorId,
      status: { [Op.ne]: 'Cancelled' },
      dateTime: { [Op.gte]: literal('CURRENT_DATE()') },
    },
    include: [
      { model: Location, as: 'location', attributes: ['name'] },
      { model: Specialty, as: 'specialty', attributes: ['name'] },
      {
        model: Patient, as: 'patient',
        include: [{ model: User, as: 'user', attributes: ['nationalId', 'firstName', 'lastName'] }],
      },
    ],
    order: [['dateTime', 'ASC']],
  });

  return appointments.map(t => ({
    location: t.location?.name,
    specialty: t.specialty?.name,
    dateTime: t.dateTime,
    status: t.status,
    nationalId: t.patient?.user?.nationalId,
    fullName: `${t.patient?.user?.firstName || ''} ${t.patient?.user?.lastName || ''}`,
    dni: t.patient?.user?.nationalId,
    patientName: `${t.patient?.user?.firstName || ''} ${t.patient?.user?.lastName || ''}`.trim(),
  }));
};

export const getDoctorAppointmentsToday = async (doctorId) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const appointments = await Appointment.findAll({
    where: {
      doctorId,
      status: 'Confirmed',
      dateTime: { [Op.gte]: startOfDay, [Op.lt]: endOfDay },
    },
    include: [
      { model: Location, as: 'location', attributes: ['name'] },
      { model: Specialty, as: 'specialty', attributes: ['name'] },
      {
        model: Patient, as: 'patient',
        include: [{ model: User, as: 'user', attributes: ['nationalId', 'firstName', 'lastName'] }],
      },
    ],
    order: [['dateTime', 'ASC']],
  });

  return appointments.map(t => ({
    location: t.location?.name,
    specialty: t.specialty?.name,
    dateTime: t.dateTime,
    status: t.status,
    nationalId: t.patient?.user?.nationalId,
    fullName: `${t.patient?.user?.firstName || ''} ${t.patient?.user?.lastName || ''}`.trim(),
    dni: t.patient?.user?.nationalId,
    patientName: `${t.patient?.user?.firstName || ''} ${t.patient?.user?.lastName || ''}`.trim(),
  }));
};

export const getDoctorAppointmentsByDate = async (doctorId, dateTime) => {
  const appointments = await Appointment.findAll({
    where: {
      doctorId,
      status: { [Op.ne]: 'Cancelled' },
      [Op.and]: literal(`DATE(dateTime) = '${dateTime}'`),
    },
    include: [
      { model: Location, as: 'location', attributes: ['name'] },
      { model: Specialty, as: 'specialty', attributes: ['name'] },
      {
        model: Patient, as: 'patient',
        include: [{ model: User, as: 'user', attributes: ['nationalId', 'firstName', 'lastName'] }],
      },
    ],
    order: [['dateTime', 'ASC']],
  });

  return appointments.map(t => ({
    location: t.location?.name,
    specialty: t.specialty?.name,
    dateTime: t.dateTime,
    status: t.status,
    nationalId: t.patient?.user?.nationalId,
    fullName: `${t.patient?.user?.firstName || ''} ${t.patient?.user?.lastName || ''}`.trim(),
    dni: t.patient?.user?.nationalId,
    patientName: `${t.patient?.user?.firstName || ''} ${t.patient?.user?.lastName || ''}`.trim(),
  }));
};

export const confirmAppointment = async (appointmentId) => {
  const [affectedRows] = await Appointment.update(
    { status: 'Confirmed', confirmationDate: new Date() },
    { where: { id: appointmentId } }
  );
  return affectedRows > 0;
};

export const cancelAppointment = async (appointmentId) => {
  const [affectedRows] = await Appointment.update(
    { status: 'Cancelled', cancellationDate: new Date() },
    { where: { id: appointmentId } }
  );
  return affectedRows > 0;
};

export const createNewAppointment = async (appointmentData) => {
  const normalizedDateTime = normalizeClinicDateTimeToUtc(appointmentData.dateTime);

  return sequelize.transaction(async (transaction) => {
    const patientExists = await Patient.findByPk(appointmentData.patientId, { transaction });
    if (!patientExists) {
      const error = new Error(`Patient with id ${appointmentData.patientId} not found`);
      error.statusCode = 404;
      throw error;
    }

    const doctorExists = await Doctor.findByPk(appointmentData.doctorId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!doctorExists) {
      const error = new Error(`Doctor with id ${appointmentData.doctorId} not found`);
      error.statusCode = 404;
      throw error;
    }

    const occupiedAppointment = await Appointment.findOne({
      where: {
        doctorId: appointmentData.doctorId,
        dateTime: normalizedDateTime,
        status: { [Op.ne]: 'Cancelled' },
        cancellationDate: null,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (occupiedAppointment) {
      throw createSlotUnavailableError();
    }

    try {
      return await Appointment.create(
        {
          ...appointmentData,
          dateTime: normalizedDateTime,
          status: 'Pending',
          cancellationDate: null,
          confirmationDate: null,
        },
        { transaction }
      );
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw createSlotUnavailableError();
      }
      throw error;
    }
  });
};

export const deleteExistingAppointment = async (appointmentId) => {
  const affectedRows = await Appointment.destroy({ where: { id: appointmentId } });
  return affectedRows > 0;
};

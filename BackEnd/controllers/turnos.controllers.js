import { Op } from 'sequelize';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Location from '../models/Location.js';
import Specialty from '../models/Specialty.js';
import Doctor from '../models/Doctor.js';

export const getTurnoByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const appointments = await Appointment.findAll({
      include: [
        {
          model: Patient,
          include: [User]
        },
        Location,
        Specialty,
        {
          model: Doctor,
          include: [User]
        }
      ],
      where: {
        '$Patient.User.national_id$': dni,
        date_time: { [Op.gt]: new Date() },
        status: { [Op.ne]: 'Cancelado' }
      },
      order: [['date_time', 'ASC']]
    });

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No hay próximos turnos para este paciente' });
    } else {
      const result = appointments.map(app => ({
        dni: app.Patient.User.national_id,
        fecha_hora: app.date_time.toISOString().slice(0, 19).replace('T', ' '),
        Sede: app.Location.name,
        Direccion: app.Location.address,
        Especialidad: app.Specialty.name,
        Doctor: app.Doctor.User.last_name,
        estado: app.status,
        idTurno: app.id
      }));
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnoByDoctorHistorico = async (req, res) => {
  try {
    const { idDoctor } = req.body;
    const appointments = await Appointment.findAll({
      where: {
        doctor_id: idDoctor,
        date_time: { [Op.gte]: new Date() },
        status: { [Op.ne]: 'Cancelado' }
      },
      include: [
        {
          model: Patient,
          include: [User]
        },
        Location,
        Specialty
      ],
      order: [['date_time', 'ASC']]
    });

    const result = appointments.map(app => ({
      sede: app.Location.name,
      especialidad: app.Specialty.name,
      fechaYHora: app.date_time,
      estado: app.status,
      dni: app.Patient.User.national_id,
      nomyapel: `${app.Patient.User.last_name} ${app.Patient.User.first_name}`
    }));
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnoByDoctorHoy = async (req, res) => {
  try {
    const { idDoctor } = req.body;
    const [result] = await pool.query(`select sed.nombre sede,esp.nombre especialidad,tur.fechaYHora,tur.estado,usu.dni,concat(usu.apellido,' ',usu.nombre) nomyapel from  turnos tur
      inner join pacientes pac
      on pac.idPaciente = tur.idPaciente
      inner join usuarios usu 
      on usu.dni = pac.dni
      inner join sedes sed
      on sed.idSede = tur.idSede
      inner join especialidades esp
      on esp.idEspecialidad = tur.idEspecialidad
      where tur.idDoctor = ? and date(tur.fechaYHora) = current_date()
      and tur.estado = 'Confirmado'
      order by tur.fechaYHora`,
      [idDoctor]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay turnos' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getTurnoByDoctorFecha = async (req, res) => {
  try {
    const { idDoctor, fechaYHora } = req.body;
    const [result] = await pool.query(`select sed.nombre sede,esp.nombre especialidad,tur.fechaYHora,tur.estado,usu.dni,concat(usu.apellido,' ',usu.nombre) nomyapel from  turnos tur
      inner join pacientes pac
      on pac.idPaciente = tur.idPaciente
      inner join usuarios usu 
      on usu.dni = pac.dni
      inner join sedes sed
      on sed.idSede = tur.idSede
      inner join especialidades esp
      on esp.idEspecialidad = tur.idEspecialidad
      where tur.idDoctor = ? and date(tur.fechaYHora) = ?
      order by tur.fechaYHora`,
      [idDoctor, fechaYHora]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay turnos' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const confirmarTurno = async (req, res) => {
  try {
    const { idTurno } = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato 'YYYY-MM-DD HH:MM:SS'

    const [result] = await pool.query(
      'UPDATE turnos SET estado = ?, fechaConfirmacion = ? WHERE idTurno = ?',
      ["Confirmado", currentDate, idTurno]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json({ message: 'Estado del turno actualizado a "Confirmado"' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const cancelarTurno = async (req, res) => {
  try {
    const { idTurno } = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato 'YYYY-MM-DD HH:MM:SS'

    const [result] = await pool.query(
      'UPDATE turnos SET estado = ?, fechaCancelacion = ? WHERE idTurno = ?',
      ["Cancelado", currentDate, idTurno]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json({ message: 'Estado del turno actualizado a "Cancelado"' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const createTurno = async (req, res) => {
  const mail = null;
  const {
    idPaciente,
    fechaYHora,
    fechaCancelacion,
    fechaConfirmacion,
    estado,
    idEspecialidad,
    idDoctor,
    idSede,
  } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO turnos (idPaciente, fechaYHora, fechaCancelacion, fechaConfirmacion, estado, idEspecialidad, idDoctor, idSede, mail) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idPaciente,
        fechaYHora,
        fechaCancelacion,
        fechaConfirmacion,
        estado,
        idEspecialidad,
        idDoctor,
        idSede,
        mail
      ]
    );
    res.json({
      idTurno: result.insertId,
      idPaciente,
      fechaYHora,
      fechaCancelacion,
      fechaConfirmacion,
      estado,
      idEspecialidad,
      idDoctor,
      idSede,
      mail
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deleteTurno = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM turnos WHERE idTurno = ?', [
      req.params.idTurnos,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'error' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

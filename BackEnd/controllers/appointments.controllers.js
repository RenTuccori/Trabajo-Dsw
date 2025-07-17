import { pool } from '../db.js';

export const getTurnoByDni = async (req, res) => {
  try {
    const { dni } = req.body;

    const [result] = await pool.query(
      `
      SELECT p.dni, DATE_FORMAT(a.dateTime, '%Y-%m-%d %H:%i:%s') AS dateTime, s.name AS venue, s.address AS address, sp.name AS specialty, usudoc.lastName AS doctor, a.status, a.idAppointment
      FROM users u
      inner JOIN patients p on u.dni = p.dni 
      inner join appointments a on p.idPatient = a.idPatient 
      inner join sites s on s.idSite = a.idSite
      inner join doctors doc on a.idDoctor = doc.idDoctor 
      inner join specialties sp on sp.idSpecialty = a.idSpecialty 
      inner join users usudoc on doc.dni = usudoc.dni WHERE u.dni = ?
      and date(a.dateTime) > current_date() and a.status != 'Cancelado'
      order by a.dateTime`,
      [dni]
    );

    if (result.length === 0) {
      return res.status(200).json([]);
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error('❌ BACKEND - Error en getTurnoByDni:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnoByDoctorHistorico = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const [result] = await pool.query(
      `
      SELECT 
        s.name AS venue, 
        sp.name AS specialty, 
        a.dateTime, 
        a.status, 
        u.dni, 
        CONCAT(u.lastName, ' ', u.firstName) AS patientName 
      FROM appointments a
      INNER JOIN patients p ON p.idPatient = a.idPatient
      INNER JOIN users u ON u.dni = p.dni
      INNER JOIN sites s ON s.idSite = a.idSite
      INNER JOIN specialties sp ON sp.idSpecialty = a.idSpecialty
      WHERE a.idDoctor = ? 
      AND a.dateTime >= current_date() 
      AND a.status != 'Cancelado'
      ORDER BY a.dateTime`,
      [doctorId]
    );

    // If no results, return 200 with empty array
    if (result.length === 0) {
      return res
        .status(200)
        .json({ message: 'No historical appointments', data: [] });
    }

    // If there are results, return the appointments list
    return res.json({ data: result });
  } catch (error) {
    // In case of error, return 500
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnoByDoctorHoy = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const [result] = await pool.query(
      `select s.name venue,sp.name specialty,a.dateTime,a.status,u.dni,concat(u.lastName,' ',u.firstName) patientName from  appointments a
      inner join patients p
      on p.idPatient = a.idPatient
      inner join users u 
      on u.dni = p.dni
      inner join sites s
      on s.idSite = a.idSite
      inner join specialties sp
      on sp.idSpecialty = a.idSpecialty
      where a.idDoctor = ? and date(a.dateTime) = current_date()
      and a.status = 'Confirmado'
      order by a.dateTime`,
      [doctorId]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'No appointments' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnoByDoctorFecha = async (req, res) => {
  try {
    const { doctorId, dateTime } = req.body;
    const [result] = await pool.query(
      `select s.name venue,sp.name specialty,a.dateTime,a.status,u.dni,concat(u.lastName,' ',u.firstName) patientName from  appointments a
      inner join patients p
      on p.idPatient = a.idPatient
      inner join users u 
      on u.dni = p.dni
      inner join sites s
      on s.idSite = a.idSite
      inner join specialties sp
      on sp.idSpecialty = a.idSpecialty
      where a.idDoctor = ? and date(a.dateTime) = ?
      order by a.dateTime`,
      [doctorId, dateTime]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'No appointments' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const confirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format 'YYYY-MM-DD HH:MM:SS'

    const [result] = await pool.query(
      'UPDATE appointments SET status = ?, confirmationDate = ? WHERE idAppointment = ?',
      ['Confirmado', currentDate, appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment status updated to "Confirmado"' });
  } catch (error) {
    console.error('❌ BACKEND - Error en confirmAppointment:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format 'YYYY-MM-DD HH:MM:SS'

    const [result] = await pool.query(
      'UPDATE appointments SET status = ?, cancellationDate = ? WHERE idAppointment = ?',
      ['Cancelado', currentDate, appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment status updated to "Cancelado"' });
  } catch (error) {
    console.error('❌ BACKEND - Error en cancelAppointment:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  const mail = null;

  const {
    patientId,
    dateTime,
    dateAndTime, // También capturar dateAndTime por si viene con este nombre
    cancellationDate,
    confirmationDate,
    status,
    specialtyId,
    doctorId,
    venueId,
  } = req.body;

  // Usar dateAndTime si dateTime no existe
  const finalDateTime = dateTime || dateAndTime;

  if (!patientId) {
    return res.status(400).json({ message: 'patientId is required' });
  }

  if (!finalDateTime) {
    return res.status(400).json({ message: 'dateTime is required' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO appointments (idPatient, dateTime, cancellationDate, confirmationDate, status, idSpecialty, idDoctor, idSite, email) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        finalDateTime, // Usar finalDateTime en lugar de dateTime
        cancellationDate,
        confirmationDate,
        status,
        specialtyId,
        doctorId,
        venueId,
        mail,
      ]
    );

    res.json({
      idAppointment: result.insertId,
      idPatient: patientId,
      dateTime: finalDateTime,
      cancellationDate: cancellationDate,
      confirmationDate: confirmationDate,
      status: status,
      idSpecialty: specialtyId,
      idDoctor: doctorId,
      idSite: venueId,
      email: mail,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM appointments WHERE idAppointment = ?',
      [req.params.appointmentId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'error' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

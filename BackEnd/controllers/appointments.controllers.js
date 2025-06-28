import { pool } from '../db.js';

export const getTurnoByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const [result] = await pool.query(`
      SELECT pac.dni, DATE_FORMAT(tur.fechaYhora, '%Y-%m-%d %H:%i:%s') AS fecha_hora, sed.first_name Sede, sed.address Direccion, esp.first_name Especialidad, usudoc.last_name Doctor, tur.estado, tur.idTurno
      FROM users usu
      inner JOIN patients pac on usu.dni = pac.dni 
      inner join appointments tur on pac.idPaciente = tur.idPaciente 
      inner join venues sed on sed.idSede = tur.idSede
      inner join doctors doc on tur.idDoctor = doc.idDoctor 
      inner join specialties esp on esp.idEspecialidad = tur.idEspecialidad 
      inner join users usudoc on doc.dni = usudoc.dni WHERE usu.dni = ?
      and date(tur.fechaYHora) > current_date() and tur.estado != 'Cancelado'
      order by tur.fechaYHora`,
      [dni]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay próximos appointments para este patient' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnoByDoctorHistorico = async (req, res) => {
  try {
    const { idDoctor } = req.body;
    const [result] = await pool.query(`
      SELECT 
        sed.first_name AS venue, 
        esp.first_name AS specialty, 
        tur.fechaYHora, 
        tur.estado, 
        usu.dni, 
        CONCAT(usu.last_name, ' ', usu.first_name) AS nomyapel 
      FROM appointments tur
      INNER JOIN patients pac ON pac.idPaciente = tur.idPaciente
      INNER JOIN users usu ON usu.dni = pac.dni
      INNER JOIN venues sed ON sed.idSede = tur.idSede
      INNER JOIN specialties esp ON esp.idEspecialidad = tur.idEspecialidad
      WHERE tur.idDoctor = ? 
      AND tur.fechaYHora >= current_date() 
      AND tur.estado != 'Cancelado'
      ORDER BY tur.fechaYHora`, 
      [idDoctor]
    );

    // Si no hay resultados, se devuelve un 200 con un arreglo vacío
    if (result.length === 0) {
      return res.status(200).json({ message: 'No hay appointments históricos', data: [] });
    }

    // Si hay resultados, se devuelve la lista de appointments
    return res.json({ data: result });
  } catch (error) {
    // En caso de error, se devuelve un 500
    return res.status(500).json({ message: error.message });
  }
};

export const getTurnoByDoctorHoy = async (req, res) => {
  try {
    const { idDoctor } = req.body;
    const [result] = await pool.query(`select sed.first_name venue,esp.first_name specialty,tur.fechaYHora,tur.estado,usu.dni,concat(usu.last_name,' ',usu.first_name) nomyapel from  appointments tur
      inner join patients pac
      on pac.idPaciente = tur.idPaciente
      inner join users usu 
      on usu.dni = pac.dni
      inner join venues sed
      on sed.idSede = tur.idSede
      inner join specialties esp
      on esp.idEspecialidad = tur.idEspecialidad
      where tur.idDoctor = ? and date(tur.fechaYHora) = current_date()
      and tur.estado = 'Confirmado'
      order by tur.fechaYHora`,
      [idDoctor]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay appointments' });
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
    const [result] = await pool.query(`select sed.first_name venue,esp.first_name specialty,tur.fechaYHora,tur.estado,usu.dni,concat(usu.last_name,' ',usu.first_name) nomyapel from  appointments tur
      inner join patients pac
      on pac.idPaciente = tur.idPaciente
      inner join users usu 
      on usu.dni = pac.dni
      inner join venues sed
      on sed.idSede = tur.idSede
      inner join specialties esp
      on esp.idEspecialidad = tur.idEspecialidad
      where tur.idDoctor = ? and date(tur.fechaYHora) = ?
      order by tur.fechaYHora`,
      [idDoctor, fechaYHora]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay appointments' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const confirmAppointment = async (req, res) => {
  try {
    const { idTurno } = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato 'YYYY-MM-DD HH:MM:SS'

    const [result] = await pool.query(
      'UPDATE appointments SET estado = ?, fechaConfirmacion = ? WHERE idTurno = ?',
      ["Confirmado", currentDate, idTurno]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json({ message: 'Estado del appointment actualizado a "Confirmado"' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const cancelAppointment = async (req, res) => {
  try {
    const { idTurno } = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato 'YYYY-MM-DD HH:MM:SS'

    const [result] = await pool.query(
      'UPDATE appointments SET estado = ?, fechaCancelacion = ? WHERE idTurno = ?',
      ["Cancelado", currentDate, idTurno]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    res.json({ message: 'Estado del appointment actualizado a "Cancelado"' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const createAppointment = async (req, res) => {
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
      `INSERT INTO appointments (idPaciente, fechaYHora, fechaCancelacion, fechaConfirmacion, estado, idEspecialidad, idDoctor, idSede, mail) 
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


export const deleteAppointment = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM appointments WHERE idTurno = ?', [
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

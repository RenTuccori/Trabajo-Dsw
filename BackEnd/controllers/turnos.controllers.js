import { pool } from '../db.js';

export const getTurnoByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const [result] = await pool.query(`
      SELECT pac.dni, DATE_FORMAT(tur.fechaYhora, '%Y-%m-%d %H:%i:%s') AS fecha_hora, sed.nombre Sede, sed.direccion Direccion, esp.nombre Especialidad, usudoc.apellido Doctor, tur.estado, tur.idTurno
      FROM usuarios usu
      inner JOIN pacientes pac on usu.dni = pac.dni 
      inner join turnos tur on pac.idPaciente = tur.idPaciente 
      inner join sedes sed on sed.idSede = tur.idSede
      inner join doctores doc on tur.idDoctor = doc.idDoctor 
      inner join especialidades esp on esp.idEspecialidad = tur.idEspecialidad 
      inner join usuarios usudoc on doc.dni = usudoc.dni WHERE usu.dni = ?
      and date(tur.fechaYHora) > current_date() and tur.estado != 'Cancelado'
      order by tur.fechaYHora`,
      [dni]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay próximos turnos para este paciente' });
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
    const [result] = await pool.query(`select sed.nombre sede,esp.nombre especialidad,tur.fechaYHora,tur.estado,usu.dni,concat(usu.apellido,' ',usu.nombre) nomyapel from  turnos tur
      inner join pacientes pac
      on pac.idPaciente = tur.idPaciente
      inner join usuarios usu 
      on usu.dni = pac.dni
      inner join sedes sed
      on sed.idSede = tur.idSede
      inner join especialidades esp
      on esp.idEspecialidad = tur.idEspecialidad
      where tur.idDoctor = ? and tur.fechaYHora >= current_date() 
      and tur.estado != 'Cancelado'
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

import { pool } from '../db.js';

export const getTurnoByDni = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT pac.dni, tur.fechaYHora, sed.nombre Sede, sed.direccion Direccion, esp.nombre Especialidad, usudoc.apellido Doctor  FROM usuarios usu inner JOIN pacientes pac on usu.dni = pac.dni inner join turnos tur on pac.idPaciente = tur.idPaciente inner join sedes sed on sed.idSede = tur.idSede inner join doctores doc on tur.idDoctor = doc.idDoctor inner join especialidades esp on esp.idEspecialidad = tur.idEspecialidad inner join usuarios usudoc on doc.dni = usudoc.dni WHERE usu.dni = ?', [
      req.params.dni,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'error' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTurno = async (req, res) => {
  const {
    idTurno,
    idHorario,
    idPaciente,
    fechaTurno,
    fechaCancelacion,
    fechaConfirmacion,
    estado,
    idDoctor,
    idSede,
  } = req.body;
  try {
    await pool.query(
      'INSERT INTO turnos (idTurno, idHorario, idPaciente, fechaTurno, fechaCancelacion, fechaConfirmacion, estado, idDoctor, idSede) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
    idTurno,
    idHorario,
    idPaciente,
    fechaTurno,
    fechaCancelacion,
    fechaConfirmacion,
    estado,
    idDoctor,
    idSede,
      ]
    );
    res.json({
    idTurno,
    idHorario,
    idPaciente,
    fechaTurno,
    fechaCancelacion,
    fechaConfirmacion,
    estado,
    idDoctor,
    idSede,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deleteTurno = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM doctores WHERE idTurno = ?', [
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
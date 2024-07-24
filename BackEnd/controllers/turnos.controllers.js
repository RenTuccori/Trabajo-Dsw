import { pool } from '../db.js';


export const getTurnos = async (req, res) => {
  try {
    const { dni } = req.params; // Asume que el userId se pasa como un parámetro de ruta

    // Verifica si se ha proporcionado un userId
    if (!dni) {
      return res.status(400).json({ message: 'Falta el identificador del usuario' });
    }

    // Consulta los turnos para el usuario específico
    const [result] = await pool.query('SELECT * FROM turnos WHERE dni = ?', [dni]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay turnos próximos para este usuario' });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getTurnoById = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM turnos WHERE id = ?', [
      req.params.id,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'error' });
    } else {
      res.json(result[0]);
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

/*export const updateDoctor = async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE doctores SET / WHERE dni = ?', [
      req.body,
      req.params.dni,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    res.json({ message: 'Doctor actualizado' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};*/

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
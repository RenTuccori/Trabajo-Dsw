import { pool } from '../db.js';

export const getDoctors = async (req, res) => {
  try {
    const { idSede, idEspecialidad } = req.body;
    const [result] = await pool.query(
    `select distinct doc.idDoctor, u.nombre, u.apellido sde
     INNER JOIN doctores doc ON sde.idDoctor = doc.idDoctor
     WHERE sde.idSede = ? AND sde.idEspecialidad = ?`,
      [idSede, idEspecialidad]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay doctores para esta especialidad' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorByDni = async (req, res) => {
  try {
    const [dni] = req.body;
    const [result] = await pool.query(`SELECT doc.dni as DNI, u.nombre, u.apellido, u.email FROM 
      doctores doc INNER JOIN usuarios u 
      ON doc.dni = u.dni
      WHERE doc.dni = ?`, 
      [
      [dni],
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  const {
    idDoctor,
    dni
    } = req.body;
  try {
    await pool.query(
      'INSERT INTO doctores (idPaciente,dni) VALUES (?,?)',
      [
        idDoctor,
        dni
      ]
    );
    res.json({
      idDoctor,
      dni
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM doctores WHERE dni = ?', [
      req.params.dni,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

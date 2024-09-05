import { pool } from '../db.js';
import jwt from "jsonwebtoken";

export const getDoctors = async (req, res) => {
  try {
    const { idSede, idEspecialidad } = req.body;
    const [result] = await pool.query(
      `select doc.idDoctor, concat(u.nombre, " ", u.apellido) nombreyapellido from sededoctoresp sde
     INNER JOIN doctores doc ON sde.idDoctor = doc.idDoctor
     INNER join usuarios u on doc.dni = u.dni 
     where sde.idSede = ? and sde.idEspecialidad = ?`,
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


export const getDoctorById = async (req, res) => {
  try {
    const { idDoctor } = req.body;
    const [result] = await pool.query(`SELECT u.nombre, u.apellido FROM 
      doctores doc INNER JOIN usuarios u 
      ON doc.dni = u.dni
      WHERE doc.idDoctor = ?`,
      [idDoctor]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorByDniContra = async (req, res) => {
  try {
    const { dni, contra } = req.body;
    const [result] = await pool.query(`SELECT doc.idDoctor FROM 
      doctores doc 
      WHERE doc.dni = ? and doc.contra = ?`,
      [
        dni, contra,
      ]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    } else {
      const token = jwt.sign({ idDoctor: result[0].idDoctor }, "CLAVE_SUPER_SEGURISIMA", { expiresIn: "5m" });
      console.log('Token generado:', token);
      res.json(token);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  const { dni, duracionTurno, contra } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO doctores (dni, duracionTurno, contra) VALUES (?, ?, ?)',
      [dni, duracionTurno, contra]
    );

    const idDoctor = result.insertId;

    res.json({
      idDoctor,
      dni,
      duracionTurno,
      contra
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


export const updateDoctor = async (req, res) => {
  const { idDoctor } = req.params;
  const { duracionTurno, contra } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE doctores SET duracionTurno = ?, contra = ? WHERE idDoctor = ?',
      [duracionTurno, contra, idDoctor]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor no encontrado' });
    }
    res.json({ idDoctor, duracionTurno, contra });
    console.log('Doctor actualizado:');
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
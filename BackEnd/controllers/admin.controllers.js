import { pool } from '../db.js';
import jwt from "jsonwebtoken";

export const getAdmin = async (req, res) => {
  try {
    const { usuario, contra } = req.body;
    const [result] = await pool.query(`SELECT idAdmin FROM 
        admin ad
        WHERE ad.usuario = ? and ad.contra = ?`,
      [
        usuario, contra,
      ]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      const token = jwt.sign({ idAdmin: result[0].idAdmin }, "CLAVE_SUPER_SEGURISIMA", { expiresIn: "30m" });
      res.json(token);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSeEspDoc = async (req, res) => {
  try {
    const { idSede, idEspecialidad, idDoctor } = req.body;

    // Primero, validar si la combinación ya existe
    const result = await pool.query(
      'SELECT * FROM sededoctoresp WHERE idSede = ? AND idEspecialidad = ? AND idDoctor = ?',
      [idSede, idEspecialidad, idDoctor]
    );
if (result[0].length > 0) {
  return res.status(400).json({ message: 'Ya existe una asignación con esta combinación de sede, especialidad y doctor.' });
}
    // Si no existe, proceder a insertar
    await pool.query(
      'INSERT INTO sededoctoresp (idSede, idEspecialidad, idDoctor) VALUES (?, ?, ?)',
      [idSede, idEspecialidad, idDoctor]
    );

    res.json({
      message: 'Asignación creada con éxito.',
      idSede,
      idEspecialidad,
      idDoctor,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
import { pool } from '../db.js';

export const getPacientes = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT usu.dni, usu.nombre, usu.apellido, obra.nombre 
       FROM pacientes pac 
       INNER JOIN usuarios usu ON usu.dni = pac.dni 
       INNER JOIN obrasociales obra ON obra.idObraSocial = usu.idObraSocial
       WHERE pac.estado = 'Habilitado'`
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay pacientes habilitados' });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getPacienteByDni = async (req, res) => {
  try {
    const { dni } = req.body;
    const [result] = await pool.query(
      `SELECT pac.idPaciente 
       FROM pacientes pac
       INNER JOIN usuarios usu ON usu.dni = pac.dni
       WHERE pac.dni = ? AND pac.estado = 'Habilitado'`,
      [dni]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado o no está habilitado' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const createPaciente = async (req, res) => {
  const { dni } = req.body;
  const estado = 'Habilitado';
  try {
    const [result] = await pool.query(
      'INSERT INTO pacientes (dni, estado) VALUES (?, ?)',
      [dni, estado]
    );
    res.json({
      idPaciente: result.insertId,  // Devuelve el id autogenerado
      dni,
      estado
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

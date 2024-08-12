import { pool } from '../db.js';

export const getSpecialties = async (req, res) => {
  try {
    const {idSede} = req.params;
    const [result] = await pool.query(
    'SELECT DISTINCT sde.idEspecialidad, es.nombre FROM especialidades es INNER JOIN sededoctoresp sde ON es.idEspecialidad = sde.idEspecialidad WHERE sde.idSede = ?',
    [idSede]);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSpecialtyById = async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM especialidades WHERE id = ?',
      [req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSpecialty = async (req, res) => {
  try {
    const { idEspecialidad, nombre } = req.body;
    const [result] = await pool.query(
      'INSERT INTO especialidades(id, nombre, descripcion) VALUES (?,?,?) ',
      [idEspecialidad, nombre]
    );
    res.json({
      id: result.insertId,
      nombre,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateSpecialty = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE especialidades SET ? WHERE id = ?',
      [req.body, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    res.json({ message: 'Especialidad actualizada' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSpecialty = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM especialidades WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Especialidad no encotrada' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

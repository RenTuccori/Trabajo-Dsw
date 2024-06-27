import { pool } from '../db.js';

export const getSpecialties = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM especialidades');
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
    const { id, nombre } = req.body;
    const [result] = await pool.query(
      'INSERT INTO especialidades(id, nombre, descripcion) VALUES (?,?,?) ',
      [id, nombre, descripcion]
    );
    res.json({
      id: result.insertId,
      nombre,
      descripcion,
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

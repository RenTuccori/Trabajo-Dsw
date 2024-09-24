import { pool } from '../db.js';

export const getSpecialties = async (req, res) => {
  try {
    const { idSede } = req.body;
    const [result] = await pool.query(
      'SELECT DISTINCT sde.idEspecialidad, es.nombre FROM especialidades es INNER JOIN sededoctoresp sde ON es.idEspecialidad = sde.idEspecialidad WHERE sde.idSede = ? AND es.estado = \'Habilitado\'',
      [idSede]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSpecialities = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM especialidades WHERE estado = \'Habilitado\'');
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableSpecialties = async (req, res) => {
  try {
    const { idSede } = req.body;
    const [result] = await pool.query(
      `SELECT es.idEspecialidad, es.nombre 
       FROM especialidades es 
       WHERE es.idEspecialidad NOT IN (
         SELECT sde.idEspecialidad 
         FROM sededoctoresp sde 
         WHERE sde.idSede = ?
       ) AND es.estado = 'Habilitado'`,
      [idSede]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSpecialtyById = async (req, res) => {
  try {
    const { idEspecialidad } = req.params;
    const [result] = await pool.query(
      'SELECT * FROM especialidades WHERE idEspecialidad = ? AND estado = \'Habilitado\'',
      [idEspecialidad]
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
    const { nombre, } = req.body;
    const [result] = await pool.query(
      'INSERT INTO especialidades(nombre) VALUES (?) ',
      [nombre]
    );
    const idEspecialidad = result.insertId;
    res.json({
      idEspecialidad,
      nombre,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateSpecialty = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE especialidades SET ? WHERE idEspecialidad = ?',
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
    const { idEspecialidad } = req.params;
    const [result] = await pool.query(
      'UPDATE especialidad SET estado = "Deshabilitado" WHERE idEspecialidad = ?',
      [idEspecialidad]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    else {
      res.json({ message: 'Especialidad eliminada' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

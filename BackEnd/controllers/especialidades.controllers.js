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
    const { nombre } = req.body;
    const estado = 'Habilitado';
    const [result] = await pool.query(
      'INSERT INTO especialidades(nombre, estado) VALUES (?, ?) ',
      [nombre, estado]
    );
    res.json({
      idEspecialidad: result.insertId,
      nombre,
      estado
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

    // Iniciar una transacción para asegurar consistencia en las actualizaciones
    await pool.query('START TRANSACTION');

    // Actualizar el estado de la especialidad a "Deshabilitado"
    const [resultEspecialidad] = await pool.query(
      'UPDATE especialidades SET estado = "Deshabilitado" WHERE idEspecialidad = ?',
      [idEspecialidad]
    );

    // Si no se encontró la especialidad, devolver un error
    if (resultEspecialidad.affectedRows === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    // Actualizar el estado de las combinaciones en la tabla sededoctoresp a "Deshabilitado"
    const [resultCombinacion] = await pool.query(
      'UPDATE sededoctoresp SET estado = "Deshabilitado" WHERE idEspecialidad = ?',
      [idEspecialidad]
    );

    // Confirmar la transacción si todo salió bien
    await pool.query('COMMIT');

    // Si todo fue exitoso, devolver un mensaje de éxito
    return res.json({ message: 'Especialidad deshabilitada exitosamente' });
  } catch (error) {
    // Si ocurre un error, hacer rollback de la transacción
    await pool.query('ROLLBACK');
    return res.status(500).json({ message: error.message });
  }
};

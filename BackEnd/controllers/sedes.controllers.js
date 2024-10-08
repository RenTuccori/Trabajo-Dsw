import { pool } from '../db.js';

export const getSedes = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM sedes WHERE estado = \'Habilitado\'');
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay sedes habilitadas' });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getSedeById = async (req, res) => {
  try {
    const { idSede } = req.params;
    const [result] = await pool.query(
      'SELECT * FROM sedes WHERE idSede = ? AND estado = \'Habilitado\'',
      [idSede]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Sede no encontrada o no está habilitada' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const createSede = async (req, res) => {
  const { nombre, direccion } = req.body;
  const estado = 'Habilitado';

  try {
    const [result] = await pool.query(
      'INSERT INTO sedes (nombre, direccion, estado) VALUES (?, ?, ?)',
      [nombre, direccion, estado]
    );
    res.json({
      idSede: result.insertId,
      nombre,
      direccion,
      estado
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateSede = async (req, res) => {
  const { idSede } = req.params;
  const { nombre, direccion } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE sedes SET nombre = ?, direccion = ? WHERE idSede = ?',
      [nombre, direccion, idSede]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }
    res.json({ idSede, nombre, direccion });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deleteSede = async (req, res) => {
  try {
    const { idSede } = req.params;
    const [result] = await pool.query('UPDATE sedes SET estado = "Deshabilitado" WHERE idSede = ?',
      [idSede]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }
    return res.sendStatus(204); // 204 significa "No Content", que indica que la solicitud fue exitosa, pero no hay contenido para devolver.
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
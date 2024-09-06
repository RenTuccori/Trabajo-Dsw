import { pool } from '../db.js';

export const getSedes = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM sedes');
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay sedes' });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getSedeById = async (req, res) => {
  try {
    const { idSede } = req.params;
    const [result] = await pool.query('SELECT * FROM sedes WHERE idSede = ?',
      [idSede],
    );
    if (result.length === 0) {
      return res.status(404).json({ message: '' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSede = async (req, res) => {
  const {
    idSede,
    nombre,
    direccion,
  } = req.body;
  try {
    await pool.query(
      'INSERT INTO sede (idSede, nombre, direccion) VALUES (?, ?, ?)',
      [
        idSede,
        nombre,
        direccion,
      ]
    );
    res.json({
      idSede,
      nombre,
      direccion,
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
    const [result] = await pool.query('DELETE FROM sedes WHERE idSede = ?', [
      req.params.idSede,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
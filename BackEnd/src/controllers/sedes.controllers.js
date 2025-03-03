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
  try {
    const { nombre, direccion } = req.body;
    const estado = 'Habilitado';

    // Verificar si ya existe una sede con el mismo nombre y estado habilitado
    const [existingSede] = await pool.query(
      'SELECT * FROM sedes WHERE nombre = ? AND estado = ?',
      [nombre, estado]
    );

    if (existingSede.length > 0) {
      // Si ya existe una sede habilitada con el mismo nombre
      return res.status(400).json({ message: 'Ya existe una sede habilitada con este nombre.' });
    }

    // Insertar nueva sede con estado habilitado
    const [result] = await pool.query(
      'INSERT INTO sedes (nombre, direccion, estado) VALUES (?, ?, ?)',
      [nombre, direccion, estado]
    );

    res.json({
      idSede: result.insertId,
      nombre,
      direccion,
      estado,
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

    // Iniciar una transacción para asegurar consistencia en las actualizaciones
    await pool.query('START TRANSACTION');

    // Actualizar el estado de la sede a "Deshabilitado"
    const [resultSede] = await pool.query(
      'UPDATE sedes SET estado = "Deshabilitado" WHERE idSede = ?',
      [idSede]
    );

    // Si no se encontró la sede, devolver un error
    if (resultSede.affectedRows === 0) {
      // Si la sede no existe, hacer un rollback de la transacción
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Sede no encontrada' });
    }

    // Actualizar el estado de las combinaciones en la tabla sededoctoresp a "Deshabilitado"
    const [resultCombinacion] = await pool.query(
      'UPDATE sededoctoresp SET estado = "Deshabilitado" WHERE idSede = ?',
      [idSede]
    );

    // Confirmar la transacción si todo salió bien
    await pool.query('COMMIT');

    // Si la transacción fue exitosa, devolver 204 No Content
    return res.sendStatus(204); // No hay contenido que devolver, pero la operación fue exitosa
  } catch (error) {
    // Si ocurre un error, hacer rollback de la transacción
    await pool.query('ROLLBACK');
    return res.status(500).json({ message: error.message });
  }
};

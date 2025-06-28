import { pool } from '../db.js';

export const getVenues = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM venues WHERE estado = \'Habilitado\'');
    if (result.length === 0) {
      return res.status(404).json({ message: 'No hay venues habilitadas' });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getVenueById = async (req, res) => {
  try {
    const { idSede } = req.params;
    const [result] = await pool.query(
      'SELECT * FROM venues WHERE idSede = ? AND estado = \'Habilitado\'',
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

export const createVenue = async (req, res) => {
  try {
    const { first_name, address } = req.body;
    const estado = 'Habilitado';

    // Verificar si ya existe una venue con el mismo first_name y estado habilitado
    const [existingSede] = await pool.query(
      'SELECT * FROM venues WHERE first_name = ? AND estado = ?',
      [first_name, estado]
    );

    if (existingSede.length > 0) {
      // Si ya existe una venue habilitada con el mismo first_name
      return res.status(400).json({ message: 'Ya existe una venue habilitada con este first_name.' });
    }

    // Insertar nueva venue con estado habilitado
    const [result] = await pool.query(
      'INSERT INTO venues (first_name, address, estado) VALUES (?, ?, ?)',
      [first_name, address, estado]
    );

    res.json({
      idSede: result.insertId,
      first_name,
      address,
      estado,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const updateVenue = async (req, res) => {
  const { idSede } = req.params;
  const { first_name, address } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE venues SET first_name = ?, address = ? WHERE idSede = ?',
      [first_name, address, idSede]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sede no encontrada' });
    }
    res.json({ idSede, first_name, address });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deleteVenue = async (req, res) => {
  try {
    const { idSede } = req.params;

    // Iniciar una transacción para asegurar consistencia en las actualizaciones
    await pool.query('START TRANSACTION');

    // Actualizar el estado de la venue a "Deshabilitado"
    const [resultSede] = await pool.query(
      'UPDATE venues SET estado = "Deshabilitado" WHERE idSede = ?',
      [idSede]
    );

    // Si no se encontró la venue, devolver un error
    if (resultSede.affectedRows === 0) {
      // Si la venue no existe, hacer un rollback de la transacción
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

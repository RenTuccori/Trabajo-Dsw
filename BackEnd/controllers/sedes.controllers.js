import Location from '../models/Location.js';

export const getSedes = async (req, res) => {
  try {
    const locations = await Location.findAll({
      where: { status: 'Habilitado' }
    });
    if (locations.length === 0) {
      return res.status(404).json({ message: 'No hay sedes habilitadas' });
    } else {
      res.json(locations);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getSedeById = async (req, res) => {
  try {
    const { idSede } = req.params;
    const location = await Location.findOne({
      where: {
        id: idSede,
        status: 'Habilitado'
      }
    });
    if (!location) {
      return res.status(404).json({ message: 'Sede no encontrada o no está habilitada' });
    } else {
      res.json(location);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSede = async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    const status = 'Habilitado';

    // Verificar si ya existe una sede con el mismo nombre y estado habilitado
    const existingLocation = await Location.findOne({
      where: {
        name: nombre,
        status: status
      }
    });

    if (existingLocation) {
      return res.status(400).json({ message: 'Ya existe una sede habilitada con este nombre.' });
    }

    // Crear nueva sede
    const newLocation = await Location.create({
      name: nombre,
      address: direccion,
      status: status
    });

    res.json(newLocation);
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

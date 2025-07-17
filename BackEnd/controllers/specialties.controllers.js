import { pool } from '../db.js';

export const getSpecialties = async (req, res) => {
  try {
    const { venueId } = req.body;

    const [result] = await pool.query(
      "SELECT DISTINCT sds.idSpecialty, s.name FROM specialties s INNER JOIN sitedoctorspecialty sds ON s.idSpecialty = sds.idSpecialty WHERE sds.idSite = ? AND s.status = 'Habilitado'",
      [venueId]
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSpecialities = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM specialties WHERE status = 'Habilitado'"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableSpecialties = async (req, res) => {
  try {
    const { venueId } = req.body;
    const [result] = await pool.query(
      `SELECT s.idSpecialty, s.name 
       FROM specialties s 
       WHERE s.idSpecialty NOT IN (
         SELECT sds.idSpecialty 
         FROM sitedoctorspecialty sds 
         WHERE sds.idSite = ?
       ) AND s.status = 'Habilitado'`,
      [venueId]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSpecialtyById = async (req, res) => {
  try {
    const { specialtyId } = req.params;
    const [result] = await pool.query(
      "SELECT * FROM specialties WHERE idSpecialty = ? AND status = 'Habilitado'",
      [specialtyId]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSpecialty = async (req, res) => {
  try {
    const { name } = req.body;
    const status = 'Habilitado';

    // Check if a specialty with the same name and enabled status already exists
    const [existingSpecialty] = await pool.query(
      'SELECT * FROM specialties WHERE name = ? AND status = ?',
      [name, status]
    );

    if (existingSpecialty.length > 0) {
      // If an enabled specialty with the same name already exists
      return res.status(400).json({
        message: 'An enabled specialty with this name already exists.',
      });
    }

    // Insert new specialty with enabled status
    const [result] = await pool.query(
      'INSERT INTO specialties (name, status) VALUES (?, ?)',
      [name, status]
    );

    res.json({
      idSpecialty: result.insertId,
      name: name,
      status: status,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateSpecialty = async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE specialties SET ? WHERE idSpecialty = ?',
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
    const { specialtyId } = req.params;

    // Iniciar una transacción para asegurar consistencia en las actualizaciones
    await pool.query('START TRANSACTION');

    // Actualizar el estado de la specialty a "Deshabilitado"
    const [resultEspecialidad] = await pool.query(
      'UPDATE specialties SET status = "Deshabilitado" WHERE idSpecialty = ?',
      [specialtyId]
    );

    // Si no se encontró la specialty, devolver un error
    if (resultEspecialidad.affectedRows === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }

    // Actualizar el estado de las combinaciones en la tabla sitedoctorspecialty a "Deshabilitado"
    const [resultCombinacion] = await pool.query(
      'UPDATE sitedoctorspecialty SET status = "Deshabilitado" WHERE idSpecialty = ?',
      [specialtyId]
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
